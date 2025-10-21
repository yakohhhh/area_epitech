import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReactionsService } from './reactions.service';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get()
  async findAll() {
    return this.reactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reactionsService.findOne(id);
  }
}
