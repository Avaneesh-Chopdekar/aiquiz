import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  uuid,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 50 }).notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', {
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    length: 50,
  }).notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
