import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { JwtPayLoad } from './interface/jwt-payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(signupCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signinCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string; user: JwtPayLoad }> {
    return this.authService.signIn(signinCredentialsDto);
  }
}
