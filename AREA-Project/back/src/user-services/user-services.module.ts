import { Module } from '@nestjs/common';
import { UserServicesController } from './user-services.controller';
import { UserServicesService } from './user-services.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserServicesController],
  providers: [UserServicesService],
  exports: [UserServicesService],
})
export class UserServicesModule {}
