import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Request } from 'express';
import type { JwtPayload } from '../decorators/current-user.decorator';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { sendEmail, buildWelcomeEmail } from '../../infrastructure/email/send-email';

interface SupabaseJwtPayload {
  sub: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
  aud: string;
  exp: number;
}

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  // Supabase の JWT Signing Keys（非対称鍵）エンドポイント
  private readonly jwks = createRemoteJWKSet(
    new URL(
      `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
    ),
  );

  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const token = this.extractToken(request);
    if (!token) throw new UnauthorizedException('認証が必要です');

    const supabasePayload = await this.verifyToken(token);
    const user = await this.findOrProvisionUser(supabasePayload);
    request.user = user;
    return true;
  }

  private extractToken(request: Request): string | null {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }

  private async verifyToken(token: string): Promise<SupabaseJwtPayload> {
    try {
      const { payload } = await jwtVerify(token, this.jwks);
      return payload as unknown as SupabaseJwtPayload;
    } catch {
      throw new UnauthorizedException('トークンが無効です');
    }
  }

  private async findOrProvisionUser(
    payload: SupabaseJwtPayload,
  ): Promise<JwtPayload> {
    let user = await this.prisma.user.findUnique({
      where: { supabaseId: payload.sub },
      select: { id: true, email: true },
    });

    if (!user) {
      const displayName =
        payload.user_metadata?.full_name ??
        payload.user_metadata?.name ??
        payload.email.split('@')[0];
      const username = await this.generateUniqueUsername();
      user = await this.prisma.user.create({
        data: {
          supabaseId: payload.sub,
          email: payload.email,
          displayName,
          username,
          avatarUrl:
            payload.user_metadata?.avatar_url ??
            payload.user_metadata?.picture ??
            null,
        },
        select: { id: true, email: true },
      });
      const { subject, html } = buildWelcomeEmail(displayName);
      void sendEmail(payload.email, subject, html);
    }

    return { sub: user.id, email: user.email };
  }

  private async generateUniqueUsername(): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (;;) {
      const suffix = Array.from(
        { length: 8 },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join('');
      const candidate = `wan_${suffix}`;
      const taken = await this.prisma.user.findUnique({
        where: { username: candidate },
        select: { id: true },
      });
      if (!taken) return candidate;
    }
  }
}
