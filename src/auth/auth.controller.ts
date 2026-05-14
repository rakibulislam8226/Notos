import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  @ResponseMessage('User registered successfully')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }
  @Post('login')
  @ResponseMessage('User logged in successfully')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
