import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../infrastructure/database/prisma.service';
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

  refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        { secret: process.env.JWT_REFRESH_SECRET },
      );
      return this.issueTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('リフレッシュトークンが無効です');
    }
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
