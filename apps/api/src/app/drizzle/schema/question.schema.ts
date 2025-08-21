import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { quizzes } from './quiz.schema';
import { sql } from 'drizzle-orm';

// TODO: Add userId field to questions table

export const questions = pgTable('questions', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  quizId: uuid('quiz_id')
    .notNull()
    .references(() => quizzes.id),
  text: varchar('title', { length: 255 }).notNull(),
  options: text('options')
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  correctOptionIndex: integer('correct_option_index').notNull(),
  createdAt: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'string' })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => sql`CURRENT_TIMESTAMP`),
});
