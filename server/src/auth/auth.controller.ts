import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { GuestGuard } from './guards/guest.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GuestGuard)
  @Post('register')
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Creates a new user account and returns the profile details and access token',
  })
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'User already exists' })
  register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @UseGuards(GuestGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login user',
    description:
      'Authenticates a user and returns a JWT access token and user profile',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get profile',
    description: 'Returns the currently authenticated user profile info',
  })
  @ApiResponse({ status: 200, description: 'Success', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@Req() req: { user: User }): User {
    return req.user;
  }
}
