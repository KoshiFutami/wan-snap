import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // 認証情報がなくても通過させる（未認証時は user が null になる）
  handleRequest<TUser>(_err: unknown, user: TUser): TUser {
    return user ?? (null as TUser);
  }
}
