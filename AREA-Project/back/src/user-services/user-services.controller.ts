import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserServicesService } from './user-services.service';
import { Request } from 'express';

@Controller('user-services')
@UseGuards(JwtAuthGuard)
export class UserServicesController {
  constructor(private readonly userServicesService: UserServicesService) {}

  @Get()
  async findAll(@Req() req: Request) {
    const userId = (req.user as any).id;
    return this.userServicesService.findAllByUser(userId);
  }

  @Post()
  async connect(
    @Req() req: Request,
    @Body() body: { serviceId: number; oauthToken?: string; refreshToken?: string; config?: any },
  ) {
    const userId = (req.user as any).id;
    return this.userServicesService.connect(userId, body.serviceId, body.oauthToken, body.refreshToken, body.config);
  }

  @Delete(':id')
  async disconnect(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const userId = (req.user as any).id;
    return this.userServicesService.disconnect(userId, id);
  }
}
