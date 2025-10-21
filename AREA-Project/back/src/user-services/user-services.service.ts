import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserServicesService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: number) {
    return this.prisma.userService.findMany({
      where: { userId },
      include: {
        service: {
          include: {
            actions: true,
            reactions: true,
          },
        },
      },
    });
  }

  async connect(
    userId: number,
    serviceId: number,
    oauthToken?: string,
    refreshToken?: string,
    config?: any,
  ) {
    // Vérifier si le service existe
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    // Vérifier si l'utilisateur n'a pas déjà connecté ce service
    const existing = await this.prisma.userService.findUnique({
      where: {
        userId_serviceId: {
          userId,
          serviceId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Service already connected');
    }

    return this.prisma.userService.create({
      data: {
        userId,
        serviceId,
        oauthToken,
        refreshToken,
        config: config ? JSON.stringify(config) : null,
      },
      include: {
        service: true,
      },
    });
  }

  async disconnect(userId: number, userServiceId: number) {
    const userService = await this.prisma.userService.findUnique({
      where: { id: userServiceId },
    });

    if (!userService) {
      throw new NotFoundException(`UserService with ID ${userServiceId} not found`);
    }

    if (userService.userId !== userId) {
      throw new ForbiddenException('You can only disconnect your own services');
    }

    await this.prisma.userService.delete({
      where: { id: userServiceId },
    });

    return { message: 'Service disconnected successfully' };
  }
}
