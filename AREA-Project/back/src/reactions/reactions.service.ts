import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReactionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reaction.findMany({
      include: {
        service: true,
      },
    });
  }

  async findOne(id: number) {
    const reaction = await this.prisma.reaction.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${id} not found`);
    }

    return reaction;
  }
}
