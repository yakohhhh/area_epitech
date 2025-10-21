import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @UseGuards(JwtAuthGuard)
  async sendEmail(
    @Request() req: any,
    @Body() body: { to: string; subject: string; body: string },
  ): Promise<{ message: string; contact?: { created?: boolean; exists?: boolean; error?: string } }> {
    const userId = req.user?.id || req.user?.sub;
    const userEmail = req.user?.email;
    const res = await this.emailService.sendEmail(userId, userEmail, body.to, body.subject, body.body);
    return { message: res.message, contact: res.contact };
  }
}