import { z } from 'zod';

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url('DATABASE_URL 형식이 올바르지 않습니다.'),
  GEMINI_API_KEY: z
    .string()
    .min(1, 'GEMINI_API_KEY가 설정되지 않았습니다.')
    .optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('Supabase URL 형식이 올바르지 않습니다.'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key가 설정되지 않았습니다.'),
});

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
