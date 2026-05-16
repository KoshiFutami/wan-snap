import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  // 認証情報がなくても通過させる（未認証時は user が null になる）
  override handleRequest<TUser>(
    _err: unknown,
    user: TUser | null,
  ): TUser | null {
    return user ?? null;
  }
}
