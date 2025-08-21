import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('v1/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  create(@Req() req: any, @Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.quizService.findAll(req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.quizService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto
  ) {
    return this.quizService.update(id, updateQuizDto, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.quizService.remove(id, req.user.userId);
  }
}
