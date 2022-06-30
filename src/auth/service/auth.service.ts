import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repository/user.repository';
import { JwtPayLoad } from '../interface/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { SigninCredentialsDto } from '../dto/signin-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(signupCredentialsDto: SignupCredentialsDto): Promise<void> {
    return this.userRepository.signUp(signupCredentialsDto);
  }

  async signIn(
    signInCredentialsDto: SigninCredentialsDto,
  ): Promise<{ accessToken: string; user: JwtPayLoad }> {
    const resp = await this.userRepository.validateUserPassword(
      signInCredentialsDto,
    );
    if (!resp) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(resp);

    return {
      accessToken,
      user: resp,
    };
  }
}
