import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface UpdateProfileDto {
  username?: string;
  email?: string;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUserProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updateProfile(userId: number, updateData: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  async getUserServices(userId: number) {
    // TODO: Implémenter la récupération des services de l'utilisateur
    return [];
  }

  async getUserAreas(userId: number) {
    // TODO: Implémenter la récupération des AREA de l'utilisateur
    return [];
  }

  async deleteUser(userId: number) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}