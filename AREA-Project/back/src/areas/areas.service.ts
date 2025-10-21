import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAreaDto, UpdateAreaDto } from './dto/area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.area.findMany({
      where: { userId },
      include: {
        action: {
          include: {
            service: true,
          },
        },
        reaction: {
          include: {
            service: true,
          },
        },
        actionService: {
          include: {
            service: true,
          },
        },
        reactionService: {
          include: {
            service: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(userId: number, id: number) {
    const area = await this.prisma.area.findUnique({
      where: { id },
      include: {
        action: {
          include: {
            service: true,
          },
        },
        reaction: {
          include: {
            service: true,
          },
        },
        actionService: {
          include: {
            service: true,
          },
        },
        reactionService: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundException(`Area with ID ${id} not found`);
    }

    if (area.userId !== userId) {
      throw new ForbiddenException('You can only access your own areas');
    }

    return area;
  }

  async create(userId: number, createAreaDto: CreateAreaDto) {
    // Vérifier que l'action existe
    const action = await this.prisma.action.findUnique({
      where: { id: createAreaDto.actionId },
    });

    if (!action) {
      throw new NotFoundException(`Action with ID ${createAreaDto.actionId} not found`);
    }

    // Vérifier que la réaction existe
    const reaction = await this.prisma.reaction.findUnique({
      where: { id: createAreaDto.reactionId },
    });

    if (!reaction) {
      throw new NotFoundException(`Reaction with ID ${createAreaDto.reactionId} not found`);
    }

    // Vérifier que les UserServices appartiennent à l'utilisateur
    const actionService = await this.prisma.userService.findUnique({
      where: { id: createAreaDto.actionServiceId },
    });

    if (!actionService || actionService.userId !== userId) {
      throw new ForbiddenException('Invalid action service');
    }

    const reactionService = await this.prisma.userService.findUnique({
      where: { id: createAreaDto.reactionServiceId },
    });

    if (!reactionService || reactionService.userId !== userId) {
      throw new ForbiddenException('Invalid reaction service');
    }

    // Vérifier que les services correspondent
    if (action.serviceId !== actionService.serviceId) {
      throw new BadRequestException('Action service mismatch');
    }

    if (reaction.serviceId !== reactionService.serviceId) {
      throw new BadRequestException('Reaction service mismatch');
    }

    return this.prisma.area.create({
      data: {
        userId,
        name: createAreaDto.name,
        description: createAreaDto.description,
        actionId: createAreaDto.actionId,
        actionServiceId: createAreaDto.actionServiceId,
        actionParams: createAreaDto.actionParams ? JSON.stringify(createAreaDto.actionParams) : null,
        reactionId: createAreaDto.reactionId,
        reactionServiceId: createAreaDto.reactionServiceId,
        reactionParams: createAreaDto.reactionParams ? JSON.stringify(createAreaDto.reactionParams) : null,
      },
      include: {
        action: {
          include: {
            service: true,
          },
        },
        reaction: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async update(userId: number, id: number, updateAreaDto: UpdateAreaDto) {
    const area = await this.findOne(userId, id);

    return this.prisma.area.update({
      where: { id },
      data: {
        name: updateAreaDto.name ?? area.name,
        description: updateAreaDto.description ?? area.description,
        actionParams: updateAreaDto.actionParams
          ? JSON.stringify(updateAreaDto.actionParams)
          : area.actionParams,
        reactionParams: updateAreaDto.reactionParams
          ? JSON.stringify(updateAreaDto.reactionParams)
          : area.reactionParams,
        isActive: updateAreaDto.isActive ?? area.isActive,
      },
      include: {
        action: {
          include: {
            service: true,
          },
        },
        reaction: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async delete(userId: number, id: number) {
    await this.findOne(userId, id);

    await this.prisma.area.delete({
      where: { id },
    });

    return { message: 'Area deleted successfully' };
  }

  async toggle(userId: number, id: number, isActive: boolean) {
    await this.findOne(userId, id);

    return this.prisma.area.update({
      where: { id },
      data: { isActive },
      include: {
        action: {
          include: {
            service: true,
          },
        },
        reaction: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async getExecutions(userId: number, areaId: number) {
    await this.findOne(userId, areaId);

    return this.prisma.execution.findMany({
      where: { areaId },
      orderBy: {
        executedAt: 'desc',
      },
      take: 50, // Limiter à 50 dernières exécutions
    });
  }
}
