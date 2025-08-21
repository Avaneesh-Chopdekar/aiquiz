import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { questions } from '../drizzle/schema';
import { and, eq } from 'drizzle-orm';

@Injectable()
export class QuestionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createQuestionDto: CreateQuestionDto, _userId: string) {
    const existing = await this.db.query.questions.findFirst({
      where: eq(questions.text, createQuestionDto.text),
    });

    if (existing) {
      if (existing.text === createQuestionDto.text) {
        throw new ConflictException('Question already exists');
      }
    }

    const [question] = await this.db
      .insert(questions)
      .values({
        text: createQuestionDto.text,
        options: createQuestionDto.options,
        correctOptionIndex: createQuestionDto.correctOptionIndex,
        quizId: createQuestionDto.quizId,
      })
      .returning({ id: questions.id, text: questions.text });
    return question;
  }

  async findAll(_userId: string) {
    return await this.db
      .select({
        id: questions.id,
        text: questions.text,
        options: questions.options,
        correctOptionIndex: questions.correctOptionIndex,
        quizId: questions.quizId,
      })
      .from(questions);
  }

  async findOne(id: string, _userId: string) {
    const [question] = await this.db
      .select({
        id: questions.id,
        text: questions.text,
        options: questions.options,
        correctOptionIndex: questions.correctOptionIndex,
        quizId: questions.quizId,
      })
      .from(questions)
      .where(eq(questions.id, id));
    return question;
  }

  async update(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
    _userId: string
  ) {
    if (updateQuestionDto.text) {
      const existing = await this.db.query.questions.findFirst({
        where: eq(questions.text, updateQuestionDto.text),
      });
      if (existing) {
        if (existing.text === updateQuestionDto.text) {
          throw new ConflictException('Question already exists');
        }
      }
    }
    const [question] = await this.db
      .update(questions)
      .set(updateQuestionDto)
      .where(eq(questions.id, id))
      .returning({ id: questions.id, text: questions.text });
    return question;
  }

  async remove(id: string, _userId: string) {
    await this.db.delete(questions).where(and(eq(questions.id, id)));
  }
}
