import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { UserInfo } from '../../user/entity/user-info.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SigninCredentialsDto } from '../dto/signin-credentials.dto';
import { JwtPayLoad } from '../interface/jwt-payload.interface';

export class UserRepository extends Repository<User> {
  private SignupCredentialsDto: SignupCredentialsDto;
  private signupCredentialsDto: any;
  async signUp(SignupCredentialsDto: SignupCredentialsDto) {
    this.SignupCredentialsDto = SignupCredentialsDto;
    const { username, password } = this.signupCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      const userInfo = new UserInfo();
      await userInfo.save();

      user.user_info = userInfo;
      await user.save();
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    signInCredentialDto: SigninCredentialsDto,
  ): Promise<JwtPayLoad> {
    const { username, password } = signInCredentialDto;
    const auth = await this.findOne({ username });

    if (auth && (await auth.validatePassword(password))) {
      return {
        username: auth.username,
        user_info: auth.user_info,
      };
    } else {
      return null;
    }
  }

  private static async hashPassword(
    password: string,
    salt: string,
  ): Promise<string> {
    return bcrypt.has(password, salt);
  }
}
