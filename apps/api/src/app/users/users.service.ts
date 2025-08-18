import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { eq, or } from 'drizzle-orm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { users } from '../drizzle/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.db.query.users.findFirst({
      where: or(
        eq(users.email, createUserDto.email),
        eq(users.username, createUserDto.username)
      ),
    });

    if (existing) {
      if (existing.email === createUserDto.email) {
        throw new ConflictException('Email already exists');
      }
      if (existing.username === createUserDto.username) {
        throw new ConflictException('Username already exists');
      }
      return null;
    } else {
      const hashedPassword = await hash(createUserDto.password, 10);
      return await this.db
        .insert(users)
        .values({
          username: createUserDto.username,
          email: createUserDto.email,
          passwordHash: hashedPassword,
          role: createUserDto.role,
          emailVerified: false,
        })
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          emailVerified: users.emailVerified,
          role: users.role,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        });
    }
  }

  async findAll() {
    return await this.db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
  }

  async findById(id: string) {
    const [user] = await this.db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id));

    return user;
  }

  async findByEmail(id: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, id));
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email || updateUserDto.username) {
      const existing = await this.db.query.users.findFirst({
        where: or(
          eq(users.email, updateUserDto.email || ''),
          eq(users.username, updateUserDto.username || '')
        ),
      });

      if (existing) {
        if (existing.email === updateUserDto.email) {
          throw new ConflictException('Email already exists');
        }
        if (existing.username === updateUserDto.username) {
          throw new ConflictException('Username already exists');
        }
        return null;
      }
    }
    const [user] = await this.db
      .update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        emailVerified: users.emailVerified,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return user;
  }

  async remove(id: string) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
