import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };
  const jwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  let service: AuthService;
  const compareMock = bcrypt.compare as jest.Mock<
    Promise<boolean>,
    [string, string]
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.sign.mockReturnValue('token');
    service = new AuthService(prisma as never, jwtService as never);
  });

  it('refresh で最新のメールアドレスを使ってトークンを再発行する', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'old@example.com',
    });
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'new@example.com',
    });

    const tokens = await service.refresh('refresh-token');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      select: { id: true, email: true },
    });
    expect(jwtService.sign).toHaveBeenNthCalledWith(
      1,
      { sub: 'user-1', email: 'new@example.com' },
      expect.objectContaining({ expiresIn: '15m' }),
    );
    expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
  });

  it('メールアドレス変更時に現在のパスワードを検証して新しいトークンを返す', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'before@example.com',
      password: 'hashed-password',
    });
    prisma.user.update.mockResolvedValue({
      id: 'user-1',
      email: 'after@example.com',
    });
    compareMock.mockResolvedValue(true);

    const tokens = await service.changeEmail('user-1', {
      email: 'after@example.com',
      currentPassword: 'current-password',
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { email: 'after@example.com' },
      select: { id: true, email: true },
    });
    expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
  });

  it('同じパスワードへの変更を拒否する', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValue(true);

    await expect(
      service.changePassword('user-1', {
        currentPassword: 'same-password',
        newPassword: 'same-password',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('メールアドレス重複時は ConflictException を返す', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'before@example.com',
      password: 'hashed-password',
    });
    prisma.user.update.mockRejectedValue({ code: 'P2002' });
    compareMock.mockResolvedValue(true);

    await expect(
      service.changeEmail('user-1', {
        email: 'used@example.com',
        currentPassword: 'current-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('現在のパスワードが違う場合は変更を拒否する', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValue(false);

    await expect(
      service.changePassword('user-1', {
        currentPassword: 'wrong-password',
        newPassword: 'next-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
