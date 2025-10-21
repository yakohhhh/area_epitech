import { Controller, Get, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { UserService, UpdateProfileDto } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: Ajouter middleware d'authentification pour toutes ces routes

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@Request() req: any) {
    // Return current user profile based on JWT token
    return this.userService.getUserProfile(req.user.userId);
  }

  @Get('profile/:id')
  async getProfile(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserProfile(userId);
  }

  @Put('profile/:id')
  async updateProfile(
    @Param('id', ParseIntPipe) userId: number,
    @Body() updateData: UpdateProfileDto
  ) {
    return this.userService.updateProfile(userId, updateData);
  }

  @Get(':id/services')
  async getUserServices(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserServices(userId);
  }

  @Get(':id/areas')
  async getUserAreas(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.getUserAreas(userId);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number) {
    await this.userService.deleteUser(userId);
    return { message: 'Utilisateur supprimé avec succès' };
  }
}