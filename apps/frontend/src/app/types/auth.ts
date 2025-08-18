import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, { error: 'Password must be at least 8 characters long.' })
  .max(128, { error: 'Password must not exceed 128 characters.' })
  .regex(/[a-z]/, {
    error: 'Password must contain at least one lowercase letter.',
  })
  .regex(/[A-Z]/, {
    error: 'Password must contain at least one uppercase letter.',
  })
  .regex(/\d/, { error: 'Password must contain at least one number.' })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, {
    error: 'Password must contain at least one special character.',
  });

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: 'Username must be at least 3 characters long.' })
      .max(50, { error: 'Username must not exceed 50 characters.' }),
    email: z.email().max(50, { error: 'Email must not exceed 50 characters.' }),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    role: z.enum(['STUDENT', 'TEACHER', 'ADMIN'], {
      error: 'Please select a role.',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const loginSchema = signupSchema.omit({
  username: true,
  confirmPassword: true,
  role: true,
});

export type SignupSchema = z.infer<typeof signupSchema>;

export type SignupBody = Omit<SignupSchema, 'confirmPassword'>;

export type LoginSchema = z.infer<typeof loginSchema>;

export type UserResponse = {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthStatus = 'unknown' | 'authenticated' | 'unauthenticated';
