import { Controller, Post, Body, UnauthorizedException, Req, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/create-auth.dto';
import { AuthGuard, Roles, RolesGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { accessToken, user } = await this.authService.login(loginDto);
      return res.status(200).json({ accessToken, user });
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  async logout(@Req() req, @Res() res: Response) {
    const { id } = req.user;
    const result = await this.authService.logout(id);
    return res.status(200).json(result);
  }
}