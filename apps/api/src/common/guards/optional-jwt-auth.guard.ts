import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JWT 認証が任意のエンドポイント向けガード。
 * - トークン未指定: user = null として続行。
 * - トークン有効: user が設定される。
 * - トークン無効・期限切れ: 意図的に null として続行し、未認証扱いにする。
 *   （公開データ取得に個人化情報を上乗せするだけのエンドポイントで使用するため、
 *     無効なトークンがあっても認証失敗ではなく「ログインなし」として処理する。）
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  override handleRequest<TUser>(
    _err: unknown,
    user: TUser | null,
  ): TUser | null {
    return user ?? null;
  }
}
