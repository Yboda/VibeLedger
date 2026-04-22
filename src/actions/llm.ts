'use server';

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

const SYSTEM_INSTRUCTION = `당신은 사용자의 가계부 입력 문장을 분석해 JSON으로 변환하는 전문가입니다.
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

// SDK 없이 직접 REST API 호출 — API 버전과 모델을 명확히 제어
async function callGeminiRest(apiKey: string, prompt: string): Promise<string> {
  const model = 'gemini-2.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.1,
      maxOutputTokens: 300,
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

  console.log('[Gemini 원본 응답]', text);

  // 모델이 responseMimeType 설정에도 마크다운 코드블록으로 감싸는 경우 제거
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  console.log('[Gemini 파싱 대상]', cleaned);

  return cleaned;
}

export async function parseTransactionText(
  text: string,
  categoryNames: string[],
  categoryTypes: Record<string, 'EXPENSE' | 'INCOME'>
): Promise<ParseTransactionResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { data: null, error: 'GEMINI_API_KEY가 설정되지 않았습니다.' };
  }
  if (!text.trim()) {
    return { data: null, error: '입력 내용이 없습니다.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const prompt = `오늘 날짜: ${today}
사용 가능한 카테고리 목록: ${categoryNames.join(', ')}
카테고리별 유형: ${JSON.stringify(categoryTypes)}

입력 문장: "${text}"`;

  try {
    const raw = await callGeminiRest(apiKey, prompt);
    const parsed = JSON.parse(raw) as Partial<ParsedTransaction>;

    if (
      typeof parsed.amount !== 'number' ||
      parsed.amount <= 0 ||
      !parsed.date ||
      !parsed.categoryName ||
      !parsed.type
    ) {
      return {
        data: null,
        error: '파싱 결과가 올바르지 않습니다. 다시 입력해보세요.',
      };
    }

    return {
      data: {
        amount: Math.round(parsed.amount),
        date: parsed.date,
        description: parsed.description ?? '',
        categoryName: parsed.categoryName,
        type: parsed.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
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
