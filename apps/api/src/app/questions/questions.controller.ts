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
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';

@Controller('v1/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAccessGuard)
  @Post()
  create(@Req() req: any, @Body() createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get()
  findAll(@Req() req: any) {
    return this.questionsService.findAll(req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    return this.questionsService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto
  ) {
    return this.questionsService.update(id, updateQuestionDto, req.user.userId);
  }

  @UseGuards(JwtAccessGuard)
  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.questionsService.remove(id, req.user.userId);
  }
}
