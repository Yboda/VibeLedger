# 1. 빌드 단계 (Build Stage)
FROM node:20-alpine AS builder
WORKDIR /app

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