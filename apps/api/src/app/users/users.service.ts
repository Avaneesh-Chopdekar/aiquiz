import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { users } from '../drizzle/schema';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async create(createUserDto: CreateUserDto) {
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

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(id: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, id));
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
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
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async remove(id: string) {
    await this.db.delete(users).where(eq(users.id, id));
  }
}
