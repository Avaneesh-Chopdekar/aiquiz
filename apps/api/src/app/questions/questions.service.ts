import { Inject, Injectable } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { questions } from '../drizzle/schema';

@Injectable()
export class QuestionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createQuestionDto: CreateQuestionDto, userId: string) {
    const [question] = await this.db
      .insert(questions)
      .values({
        text: createQuestionDto.text,
        options: createQuestionDto.options,
        correctOptionIndex: createQuestionDto.correctOptionIndex,
      })
      .returning({ id: questions.id });
    return null;
  }

  findAll(userId: string) {
    return `This action returns all questions`;
  }

  findOne(id: string, userId: string) {
    return `This action returns a #${id} question`;
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto, userId: string) {
    return `This action updates a #${id} question`;
  }

  remove(id: string, userId: string) {
    return `This action removes a #${id} question`;
  }
}
