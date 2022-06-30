import { UserInfo } from '../../user/entity/user-info.entity';

export interface JwtPayLoad {
  username: string;
  user_info: UserInfo;
}
