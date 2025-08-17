export interface User {
  id: string;
  username: string;
  email: string;
  emailVerified: boolean;
  passwordHash: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}
