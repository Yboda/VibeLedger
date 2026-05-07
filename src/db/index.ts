import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { getServerEnv } from '@/lib/env';

// 데이터베이스 연결 문자열 (환경변수에서 가져옴)
const { DATABASE_URL: connectionString } = getServerEnv();

// postgres 클라이언트 생성
const client = postgres(connectionString);

// Drizzle ORM 인스턴스 생성
export const db = drizzle(client, { schema });

// Drizzle ORM 관련 모듈 재내보내기
export * from 'drizzle-orm';
export * from './schema';
