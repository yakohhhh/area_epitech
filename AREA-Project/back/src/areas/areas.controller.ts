import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AreasService } from './areas.service';
import { Request } from 'express';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';

@Controller('areas')
@UseGuards(JwtAuthGuard)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.areasService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userId = (req.user as any).id;
    return this.areasService.findOne(userId, id);
  }

  @Post()
  async create(@Req() req: Request, @Body() createAreaDto: CreateAreaDto) {
    const userId = (req.user as any).id;
    return this.areasService.create(userId, createAreaDto);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAreaDto: UpdateAreaDto,
  ) {
    const userId = (req.user as any).id;
    return this.areasService.update(userId, id, updateAreaDto);
  }

  @Delete(':id')
  async delete(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userId = (req.user as any).id;
    return this.areasService.delete(userId, id);
  }

  @Patch(':id/toggle')
  async toggle(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ) {
    const userId = (req.user as any).id;
    return this.areasService.toggle(userId, id, body.isActive);
  }

  @Get(':id/executions')
  async getExecutions(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userId = (req.user as any).id;
    return this.areasService.getExecutions(userId, id);
  }
}
