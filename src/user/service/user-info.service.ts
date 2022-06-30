import { InjectRepository } from '@nestjs/typeorm';
import { UserInfoRepository } from '../repository/user-info.repository';
import { User } from '../../auth/entity/user.entity';
import { UserInfo } from '../entity/user-info.entity';
import { NotFoundException } from '@nestjs/common';
import { UserInfoDto } from '../dto/user-info.dto';
import { userInfoData } from '../interface/user-info.interface';

export class UserService {
  constructor(
    @InjectRepository(UserInfoRepository)
    private userInfoRepository: UserInfoRepository,
  ) {}

  async getUser(user: User): Promise<UserInfo> {
    const userInfo = await this.userInfoRepository.findOne({
      where: { id: user.user_info.id },
    });

    if (!userInfo) {
      throw new NotFoundException('User not found');
    }

    return userInfo;
  }

  async updateUserProfile(
    user: User,
    userInfoDto: UserInfoDto,
  ): Promise<userInfoData> {
    const userInfo = await this.getUser(user);
    userInfo.address = userInfoDto.address;
    userInfo.petName = userInfoDto.petName;
    userInfo.photo = userInfoDto.photo;
    userInfo.modified_photo = userInfoDto.modified_photo;

    await userInfo.save();
    return userInfo;
  }
}
