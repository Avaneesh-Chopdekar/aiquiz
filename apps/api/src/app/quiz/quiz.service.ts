import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { eq, or, and } from 'drizzle-orm';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import SYSTEM_PROMPT from './system-prompt';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { DRIZZLE } from '../drizzle/drizzle.module';
import { questions, quizzes } from '../drizzle/schema';

type LLMQuestionResponse = {
  text: string;
  options: string[];
  correctOptionIndex: number;
};

type LLMResponse = {
  title: string;
  slug: string;
  questions: LLMQuestionResponse[];
};

@Injectable()
export class QuizService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(DRIZZLE) private db: DrizzleDB
  ) {}

  async create({ prompt }: CreateQuizDto, userId: string) {
    const GEMINI_API_KEY = this.configService.getOrThrow('GEMINI_API_KEY');
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: [
          {
            text: SYSTEM_PROMPT + prompt,
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });
    const jsonResponse = JSON.parse(response.text as string) as LLMResponse;
    let quizId = '';
    await this.db.transaction(async (tx) => {
      const [quiz] = await tx
        .insert(quizzes)
        .values({
          title: jsonResponse.title,
          slug: jsonResponse.slug,
          userId: userId,
        })
        .returning({
          id: quizzes.id,
        });
      quizId = quiz.id;
      const questionsList = jsonResponse.questions.map((question) => ({
        userId: userId,
        text: question.text,
        options: question.options,
        correctOptionIndex: question.correctOptionIndex,
        quizId: quiz.id,
      }));
      await tx.insert(questions).values(questionsList);
    });
    return {
      id: quizId,
      title: jsonResponse.title,
      slug: jsonResponse.slug,
    };
  }

  async findAll(userId: string) {
    return await this.db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
      })
      .from(quizzes)
      .where(eq(quizzes.userId, userId));
  }

  async findOne(id: string, userId: string) {
    const [quiz] = await this.db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
      })
      .from(quizzes)
      .where(and(eq(quizzes.id, id), eq(quizzes.userId, userId)));
    return quiz;
  }

  async update(id: string, updateQuizDto: UpdateQuizDto, userId: string) {
    if (updateQuizDto.title || updateQuizDto.slug) {
      const existing = await this.db.query.quizzes.findFirst({
        where: or(
          eq(quizzes.title, updateQuizDto.title || ''),
          eq(quizzes.slug, updateQuizDto.slug || '')
        ),
      });

      if (existing) {
        if (existing.title === updateQuizDto.title) {
          throw new ConflictException('Quiz Title already exists');
        }
        if (existing.slug === updateQuizDto.slug) {
          throw new ConflictException('Quiz Slug already exists');
        }
        return null;
      }
    }
    const [quiz] = await this.db
      .update(quizzes)
      .set(updateQuizDto)
      .where(and(eq(quizzes.id, id), eq(quizzes.userId, userId)))
      .returning({
        id: quizzes.id,
        title: quizzes.title,
        slug: quizzes.slug,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
      });

    return quiz;
  }

  async remove(id: string, userId: string) {
    await this.db
      .delete(quizzes)
      .where(and(eq(quizzes.id, id), eq(quizzes.userId, userId)));
  }
}
