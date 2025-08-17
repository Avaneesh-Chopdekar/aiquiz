import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    const user = this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = this.usersService.update(id, updateUserDto);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.usersService.remove(id);
  }
}
