import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, '이름을 입력해주세요.')
      .max(20, '이름은 20자 이하여야 합니다.'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, '이메일을 입력해주세요.')
      .max(100, '이메일은 100자 이하여야 합니다.')
      .email({ message: '유효한 이메일 주소를 입력해주세요.' }),
    password: z
      .string()
      .min(1, '비밀번호를 입력해주세요.')
      .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
      .max(100, '비밀번호는 100자 이하여야 합니다.')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        '비밀번호는 최소 1개의 소문자, 대문자, 숫자를 포함해야 합니다.'
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
