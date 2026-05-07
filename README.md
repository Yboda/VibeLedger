# VibeLedger

AI 기반 가계부 및 개인 재무 관리 앱입니다. 거래 기록, 예산 관리, 대시보드, 분석 리포트, Gemini 기반 자연어 거래 입력과 재정 인사이트를 제공합니다.

## 주요 기능

- Supabase Auth 기반 로그인, 회원가입, 이메일 인증, 비밀번호 재설정
- 거래 CRUD, 검색, 필터, 낙관적 업데이트
- CSV 거래 내보내기/가져오기
- 카테고리별 월 예산, 예산 초과/임박 알림
- 대시보드와 분석 리포트
- Gemini 기반 자연어 거래 파싱과 AI 인사이트
- Supabase RLS, RPC, seed를 포함한 재현 가능한 DB 마이그레이션

## 기술 스택

- Next.js 16 App Router, React 19, TypeScript
- Supabase Auth/Postgres, Drizzle schema/migration workflow
- TanStack Query v5
- Tailwind CSS v4, shadcn-style UI components
- Zod validation
- Vitest, ESLint, Prettier, Husky, lint-staged

## 프로젝트 구조

```text
src/
├── app/                 # App Router pages, layouts, route handlers
├── actions/             # Server Actions for auth and LLM features
├── components/          # Common and UI components
├── db/                  # Drizzle schema and DB bootstrap
├── lib/                 # API clients, validation, CSV, security utilities
├── providers/           # App-level providers
├── stores/              # Zustand stores
└── types/               # Environment and shared type declarations

supabase/
└── migrations/          # Tables, RLS policies, seed data, RPC functions
```

## 로컬 실행

1. 의존성을 설치합니다.

```bash
npm install
```

2. 환경변수를 준비합니다.

```bash
cp .env.example .env
```

필수 값:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key
- `DATABASE_URL`: Supabase Postgres connection string
- `NEXT_PUBLIC_APP_URL`: 로컬은 보통 `http://localhost:3000`
- `GEMINI_API_KEY`: AI 입력/인사이트를 사용할 때 필요

3. Supabase SQL 마이그레이션을 적용합니다.

`supabase/migrations/0001_initial_schema_rls_rpc.sql`을 Supabase SQL Editor에서 실행하거나, Supabase CLI를 사용하는 경우 프로젝트에 맞게 연결한 뒤 마이그레이션을 적용합니다.

마이그레이션에는 다음이 포함됩니다.

- `profiles`, `categories`, `transactions`, `budgets` 테이블
- 기본 카테고리 seed
- 회원가입 시 `profiles`를 생성하는 trigger
- 사용자별 Row Level Security policies
- `get_budget_with_spending`, `get_monthly_income_expense_trend` RPC

4. 개발 서버를 실행합니다.

```bash
npm run dev
```

## 품질 검증

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

한 번에 실행하려면:

```bash
npm run ci
```

GitHub Actions도 동일한 검증을 PR과 main/master push에서 실행합니다.

## Docker 실행

```bash
docker compose up --build
```

Docker 빌드 시 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`가 build arg로 필요하며, 런타임 값은 `.env`에서 로드됩니다.

## 운영 체크리스트

- Supabase Auth URL 설정에 `${NEXT_PUBLIC_APP_URL}/auth/callback`을 등록합니다.
- 배포 전에 `supabase/migrations` SQL이 운영 DB에 적용되었는지 확인합니다.
- Gemini 기능은 서버 액션에서 세션을 확인하고 간단한 사용자별 rate limit을 적용합니다.
- LLM 원문/파싱 결과는 운영 로그에 남기지 않습니다.
- 민감한 서버 전용 키는 `NEXT_PUBLIC_` 접두사를 붙이지 않습니다.
