import { z } from 'zod';
import { passwordSchema } from './signup';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('유효한 이메일 주소를 입력해주세요.')
    .max(100, '이메일은 100자 이하여야 합니다.'),
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;
