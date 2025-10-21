import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('mobile')
export class MobileController {
  @Get('health')
  healthCheck(@Req() req: Request) {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      origin: req.get('Origin') || req.get('Referer'),
      userAgent: req.get('User-Agent'),
      message: 'Mobile API connectivity successful',
      version: '1.0.0'
    };
  }

  @Get('cors-test') 
  corsTest(@Req() req: Request) {
    return {
      cors: 'enabled',
      origin: req.get('Origin'),
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      headers: req.headers,
      message: 'CORS configuration is working for mobile'
    };
  }
}