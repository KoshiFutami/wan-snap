import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { ChangeEmailDto } from './dto/change-email.dto';
import type { ChangePasswordDto } from './dto/change-password.dto';
import type { SignUpDto } from './dto/sign-up.dto';
import type { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async signUp(dto: SignUpDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists)
      throw new ConflictException('このメールアドレスは既に使用されています');

    const [hashed, username] = await Promise.all([
      bcrypt.hash(dto.password, 10),
      this.generateUniqueUsername(),
    ]);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashed,
        displayName: dto.displayName,
        username,
      },
    });

    return this.issueTokens(user.id, user.email);
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user)
      throw new UnauthorizedException(
        'メールアドレスまたはパスワードが違います',
      );

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid)
      throw new UnauthorizedException(
        'メールアドレスまたはパスワードが違います',
      );

    return this.issueTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true },
      });
      if (!user) {
        throw new UnauthorizedException('リフレッシュトークンが無効です');
      }
      return this.issueTokens(user.id, user.email);
    } catch {
      throw new UnauthorizedException('リフレッシュトークンが無効です');
    }
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });
    if (!user) throw new UnauthorizedException('ユーザーが見つかりません');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('現在のパスワードが違います');
    }
    if (user.email === dto.email) {
      throw new BadRequestException('新しいメールアドレスを入力してください');
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: { email: dto.email },
        select: { id: true, email: true },
      });
      return this.issueTokens(updated.id, updated.email);
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('このメールアドレスは既に使用されています');
      }
      throw err;
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true },
    });
    if (!user) throw new UnauthorizedException('ユーザーが見つかりません');

    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) {
      throw new UnauthorizedException('現在のパスワードが違います');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('新しいパスワードを入力してください');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return this.issueTokens(user.id, user.email);
  }

  private issueTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    };
  }
}
