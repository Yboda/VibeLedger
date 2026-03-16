# 💰 VibeLedger (바이브레저)
> **AI 기반의 지능형 가계부 및 자산 관리 솔루션**
> 
> 단순한 지출 기록을 넘어, AI 에이전트를 이용한 데이터 중심의 개인 재무 관리 도구입니다. 

---

## 1. 프로젝트 개요

### 1.1. 기술 스택 요약

| 분류 | 기술 스택 | 선택 이유 |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | SEO 최적화 및 서버 컴포넌트 기반의 성능 극대화 |
| **Language** | **TypeScript** | 정적 타입을 통한 런타임 에러 최소화 및 개발자 경험(DX) 향상 |
| **State Management** | **Zustand & TanStack Query v6** | 클라이언트 상태의 경량화 및 서버 데이터 동기화 최적화 |
| **Database / ORM** | **Supabase / Drizzle ORM** | PostgreSQL 기반의 강력한 백엔드와 타입 안전한 SQL 쿼리 작성 |
| **Styling** | **Tailwind CSS v4** | 유틸리티 퍼스트 방식을 통한 일관되고 빠른 UI 시스템 구축 |
| **Form / Validation** | **React Hook Form / Zod** | 선언적 폼 관리 및 런타임/빌드타임 통합 유효성 검사 |
| **Git Hooks** | **Husky & lint-staged** | 커밋 전 린트 및 타입 체크를 통한 코드 품질 강제 자동화 |
| **Code Quality** | **ESLint / Prettier** | 일관된 코딩 컨벤션 및 코드 스타일 유지 |

### 1.2. 프로젝트 구조 및 주요 특징

#### **[Key Features]**
* **Own Backend Architecture**: MSW 등의 모킹 라이브러리를 사용하지 않고, Supabase와 Next.js Server Actions를 직접 연동하여 **실제 동작하는 Full-stack 서비스**를 구현했습니다.
* **AI-Powered Input**: 사용자의 비정형 자연어 입력을 LLM API가 분석하여 거래 내역으로 자동 전환하는 지능형 입력 시스템을 제공합니다.
* **Strict Quality Control**: Husky를 활용한 `pre-commit` 훅을 통해 `lint`, `type-check`를 통과하지 못한 코드가 저장소에 병합되는 것을 원천 차단했습니다.
* **Optimistic UI Update**: 지출 내역 추가/삭제 시 사용자에게 즉각적인 피드백을 주기 위해 TanStack Query의 낙관적 업데이트 기법을 적용했습니다.

#### **[Directory Structure]**
```text
src/
├── app/                  # Next.js App Router (페이지 구성 및 레이아웃)
├── components/           # UI(shadcn) 및 기능별(Feature) 컴포넌트
├── db/                   # Drizzle ORM 스키마 정의 및 DB 커넥션 설정
├── hooks/                # Server State 관리 및 커스텀 훅
├── lib/                  # 외부 라이브러리(Supabase 등) 인스턴스 설정
├── services/             # 비즈니스 로직 및 Server Actions (백엔드 로직)
├── store/                # Zustand를 이용한 클라이언트 전역 상태 관리
└── types/                # TypeScript 공통 인터페이스 및 타입 정의