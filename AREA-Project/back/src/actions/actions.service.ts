import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.action.findMany({
      include: {
        service: true,
      },
    });
  }

  async findOne(id: number) {
    const action = await this.prisma.action.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!action) {
      throw new NotFoundException(`Action with ID ${id} not found`);
    }

    return action;
  }
}
