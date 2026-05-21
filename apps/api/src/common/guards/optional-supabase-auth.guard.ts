import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

/**
 * Supabase 認証が任意のエンドポイント向けガード。
 * トークン未指定・無効時は user = null として続行する。
 */
@Injectable()
export class OptionalSupabaseAuthGuard implements CanActivate {
  private readonly inner: SupabaseAuthGuard;

  constructor(prisma: PrismaService) {
    this.inner = new SupabaseAuthGuard(prisma);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await this.inner.canActivate(context);
    } catch {
      Object.assign(context.switchToHttp().getRequest<object>(), {
        user: null,
      });
      return true;
    }
  }
}
