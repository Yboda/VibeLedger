'use server';

import { createClient } from '@/lib/supabase/server';
import {
  insightItemsSchema,
  parsedTransactionSchema,
} from '@/lib/validations/llm';

export interface ParsedTransaction {
  amount: number;
  date: string; // "YYYY-MM-DD"
  description: string;
  categoryName: string;
  type: 'EXPENSE' | 'INCOME';
}

export interface ParseTransactionResult {
  data: ParsedTransaction | null;
  error: string | null;
}

export interface FinancialSummary {
  periodLabel: string;
  today: string; // "YYYY-MM-DD" — 오늘 날짜 (분석 데이터의 실제 마지막 날)
  periodEnd: string; // "YYYY-MM-DD" — 선택한 기간의 마지막 날 (미래일 수 있음)
  totalIncome: number;
  totalExpense: number;
  savingsRate: number; // percentage, e.g. 23.5
  categoryBreakdown: { name: string; amount: number }[]; // 지출 카테고리, 금액 내림차순
  overBudgetCategories: { name: string; budget: number; spent: number }[];
  transactionCount: number;
  weekendExpenseRatio: number; // 0~1 (주말 지출 / 전체 지출, 오늘까지의 데이터 기준)
}

export interface InsightItem {
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
}

export interface GenerateInsightsResult {
  data: InsightItem[] | null;
  error: string | null;
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const llmRequestLog = new Map<string, number[]>();

async function getAuthenticatedUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (llmRequestLog.get(userId) ?? []).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW_MS
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    llmRequestLog.set(userId, recent);
    return true;
  }

  llmRequestLog.set(userId, [...recent, now]);
  return false;
}

const PARSE_SYSTEM_INSTRUCTION = `당신은 사용자의 가계부 입력 문장을 분석해 JSON으로 변환하는 전문가입니다.
사용자가 자연어로 지출/수입 내역을 입력하면, 아래 JSON 형식으로만 응답하세요.

응답 형식:
{
  "amount": 숫자 (원 단위 정수, 예: 4500),
  "date": "YYYY-MM-DD" 형식의 문자열,
  "description": "간결한 거래 설명",
  "categoryName": "카테고리 이름 (아래 목록 중 하나)",
  "type": "EXPENSE" 또는 "INCOME"
}

규칙:
- amount는 반드시 양의 정수 (소수점 없음)
- "만원" → 10000 곱하기, "천원" → 1000 곱하기
- date 기준: 오늘, 어제, 그저께 등 상대 표현을 절대 날짜로 변환
- 카테고리는 반드시 제공된 목록 중 가장 적합한 것 하나를 선택
- 수입/입금/월급/용돈 관련 표현이면 type을 "INCOME"으로, 나머지는 "EXPENSE"로 설정
- JSON 이외의 텍스트, 마크다운 코드블록 등은 절대 출력하지 마세요`;

const INSIGHTS_SYSTEM_INSTRUCTION = `당신은 개인 재정 분석 전문가입니다.
사용자의 가계부 데이터를 분석해 실용적인 인사이트 3가지를 제공해주세요.

응답은 반드시 아래 JSON 배열 형식으로만 출력하세요:
[
  {
    "type": "positive" | "warning" | "info",
    "title": "제목 (15자 이내)",
    "description": "설명 (100자 이내, 구체적인 수치 포함)"
  }
]

규칙:
- 반드시 3개의 인사이트를 제공
- type: positive(긍정/칭찬), warning(주의/위험), info(유용한 팁/패턴)
- 한국어로 친근하고 따뜻한 어조로 작성
- 수치를 구체적으로 언급 (예: "식비 지출이 예산의 120%")
- 프롬프트에 "오늘 날짜"와 "기간 종료일"이 제공된다. 오늘 이후 날짜는 아직 데이터가 없으므로, 미래 날짜에 대한 평가·추론·칭찬을 절대 하지 마세요
- 예: 이번 주가 아직 수요일이라면 목~일요일 지출은 알 수 없으므로 "주말 지출 제로" 같은 평가를 하면 안 됩니다
- JSON 이외의 텍스트, 마크다운 코드블록 출력 금지`;

// SDK 없이 직접 REST API 호출 — API 버전과 모델을 명확히 제어
async function callGeminiRest(
  apiKey: string,
  systemInstruction: string,
  prompt: string,
  options?: { temperature?: number; maxOutputTokens?: number }
): Promise<string> {
  const model = 'gemini-2.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: options?.temperature ?? 0.1,
      maxOutputTokens: options?.maxOutputTokens ?? 300,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = (await res.json()) as {
      error?: { code?: number; message?: string; status?: string };
    };
    const code = errBody.error?.code;
    const status = errBody.error?.status;

    if (code === 429 || status === 'RESOURCE_EXHAUSTED') {
      throw new Error(
        'API_QUOTA: 무료 사용량 한도에 도달했습니다. 잠시 후 다시 시도해주세요.'
      );
    }
    if (res.status === 503 || status === 'UNAVAILABLE') {
      throw new Error(
        'API_BUSY: 현재 AI 서버가 혼잡합니다. 잠시 후 다시 시도해주세요.'
      );
    }
    throw new Error(
      errBody.error?.message ?? `Gemini API 오류 (HTTP ${res.status})`
    );
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini 응답이 비어있습니다.');

  // 모델이 responseMimeType 설정에도 마크다운 코드블록으로 감싸는 경우 제거
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  return cleaned;
}

export async function parseTransactionText(
  text: string,
  categoryNames: string[],
  categoryTypes: Record<string, 'EXPENSE' | 'INCOME'>
): Promise<ParseTransactionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { data: null, error: '로그인이 필요합니다.' };
  }
  if (isRateLimited(userId)) {
    return {
      data: null,
      error: 'AI 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { data: null, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' };
  }
  if (!text.trim()) {
    return { data: null, error: '입력 내용이 없습니다.' };
  }
  if (categoryNames.length === 0) {
    return { data: null, error: '사용 가능한 카테고리가 없습니다.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const prompt = `오늘 날짜: ${today}
사용 가능한 카테고리 목록: ${categoryNames.join(', ')}
카테고리별 유형: ${JSON.stringify(categoryTypes)}

입력 문장: "${text}"`;

  try {
    const raw = await callGeminiRest(apiKey, PARSE_SYSTEM_INSTRUCTION, prompt);
    const parsed = parsedTransactionSchema.safeParse(JSON.parse(raw));

    if (!parsed.success) {
      return {
        data: null,
        error: '파싱 결과가 올바르지 않습니다. 다시 입력해보세요.',
      };
    }

    const parsedData = parsed.data;
    if (
      !categoryNames.includes(parsedData.categoryName) ||
      categoryTypes[parsedData.categoryName] !== parsedData.type
    ) {
      return {
        data: null,
        error: 'AI가 선택한 카테고리가 올바르지 않습니다. 다시 입력해보세요.',
      };
    }

    return {
      data: {
        amount: parsedData.amount,
        date: parsedData.date,
        description: parsedData.description,
        categoryName: parsedData.categoryName,
        type: parsedData.type,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.startsWith('API_QUOTA:') || message.startsWith('API_BUSY:')) {
      return { data: null, error: message.replace(/^API_\w+: /, '') };
    }

    console.error('Gemini parse error:', message);
    return {
      data: null,
      error: 'AI 파싱 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}

export async function generateInsights(
  summary: FinancialSummary
): Promise<GenerateInsightsResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { data: null, error: '로그인이 필요합니다.' };
  }
  if (isRateLimited(userId)) {
    return {
      data: null,
      error: 'AI 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { data: null, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' };
  }

  const topCategories =
    summary.categoryBreakdown
      .slice(0, 5)
      .map(c => `${c.name}: ₩${c.amount.toLocaleString('ko-KR')}`)
      .join(', ') || '데이터 없음';

  const overBudgetText =
    summary.overBudgetCategories.length > 0
      ? summary.overBudgetCategories
          .map(
            b =>
              `${b.name}(예산 ₩${b.budget.toLocaleString('ko-KR')}, 실제 ₩${b.spent.toLocaleString('ko-KR')})`
          )
          .join(', ')
      : '없음';

  const isPeriodComplete = summary.today >= summary.periodEnd;
  const periodNote = isPeriodComplete
    ? `기간이 완료된 데이터입니다.`
    : `⚠️ 기간 진행 중: 오늘(${summary.today})까지의 데이터만 존재합니다. 기간 종료일(${summary.periodEnd}) 이후 날짜는 아직 기록이 없으니, 그 날짜들에 대한 평가를 하지 마세요.`;

  const prompt = `오늘 날짜: ${summary.today}
분석 기간: ${summary.periodLabel} (${summary.today} ~ ${summary.periodEnd})
${periodNote}

재정 요약 (오늘까지 실제 기록된 데이터):
- 총 수입: ₩${summary.totalIncome.toLocaleString('ko-KR')}
- 총 지출: ₩${summary.totalExpense.toLocaleString('ko-KR')}
- 저축률: ${summary.savingsRate.toFixed(1)}%
- 거래 건수: ${summary.transactionCount}건
- 주말 지출 비율: ${(summary.weekendExpenseRatio * 100).toFixed(1)}% (오늘까지 지나간 주말 기준)

카테고리별 주요 지출 (내림차순):
${topCategories}

예산 초과 카테고리:
${overBudgetText}

위 데이터를 분석해 인사이트 3가지를 JSON 배열로 반환하세요.`;

  try {
    const raw = await callGeminiRest(
      apiKey,
      INSIGHTS_SYSTEM_INSTRUCTION,
      prompt,
      { temperature: 0.7, maxOutputTokens: 600 }
    );

    const parsed = insightItemsSchema.safeParse(JSON.parse(raw));

    if (!parsed.success) {
      return { data: null, error: '인사이트 생성에 실패했습니다.' };
    }

    return { data: parsed.data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.startsWith('API_QUOTA:') || message.startsWith('API_BUSY:')) {
      return { data: null, error: message.replace(/^API_\w+: /, '') };
    }

    console.error('Gemini insights error:', message);
    return {
      data: null,
      error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
