# 1. 빌드 단계 (Build Stage)
FROM node:20-alpine AS builder
WORKDIR /app

# 빌드 시점에 Compose로부터 전달받을 변수 정의
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

# Next.js 빌드 프로세스가 읽을 수 있도록 환경 변수로 등록
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. 실행 단계 (Runner Stage)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0

# 보안을 위한 non-root 유저 생성
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# 빌드 결과물만 복사하여 이미지 용량 최적화
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]