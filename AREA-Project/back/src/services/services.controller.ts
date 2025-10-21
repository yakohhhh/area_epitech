import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  async findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.findOne(id);
  }

  @Get(':id/actions')
  async getActions(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.getActions(id);
  }

  @Get(':id/reactions')
  async getReactions(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.getReactions(id);
  }
}
