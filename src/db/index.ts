import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// 데이터베이스 연결 문자열 (환경변수에서 가져옴)
const connectionString = process.env.DATABASE_URL;

// 환경변수가 설정되지 않은 경우 에러 발생
if (!connectionString) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
}

// postgres 클라이언트 생성
const client = postgres(connectionString);

// Drizzle ORM 인스턴스 생성
export const db = drizzle(client, { schema });

// Drizzle ORM 관련 모듈 재내보내기
export * from 'drizzle-orm';
export * from './schema';
