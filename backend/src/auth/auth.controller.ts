import {
  Controller,
  Post,
  Put,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/user.dto';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UsersService } from '../users/users.service';
import { StoresService } from '../stores/stores.service';
import { RatingsService } from '../ratings/ratings.service';

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
  @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'password must contain at least one special character' })
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private storesService: StoresService,
    private ratingsService: RatingsService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Put('change-password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }

  @Get('dashboard/stats')
  @UseGuards(AuthGuard('jwt'))
  async getDashboardStats() {
    const users = await this.usersService.count();
    const stores = await this.storesService.count();
    const ratings = await this.ratingsService.count();
    return { users, stores, ratings };
  }

  @Get('owner/store')
  @UseGuards(AuthGuard('jwt'))
  async getOwnerStore(@Request() req) {
    const store = await this.storesService.findByOwnerId(req.user.id);
    if (!store) return null;
    const avgRating = await this.ratingsService.getStoreAverageRating(store.id);
    const ratings = await this.ratingsService.findByStore(store.id);
    return { ...store, averageRating: Math.round(avgRating * 100) / 100, ratings };
  }
}
