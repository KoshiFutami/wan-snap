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
  const authMailService = {
    sendSignUpNotice: jest.fn(),
    sendSignInNotice: jest.fn(),
  };

  let service: AuthService;
  const compareMock = bcrypt.compare as jest.Mock<
    Promise<boolean>,
    [string, string]
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.sign.mockReturnValue('token');
    service = new AuthService(
      prisma as never,
      jwtService as never,
      authMailService as never,
    );
  });

  it('signUp 成功時にトークン発行と登録メール送信を行う', async () => {
    prisma.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'new@example.com',
      displayName: 'テストユーザー',
    });
    const hashMock = bcrypt.hash as jest.Mock<
      Promise<string>,
      [string, number]
    >;
    hashMock.mockResolvedValue('hashed-password');

    const tokens = await service.signUp({
      email: 'new@example.com',
      password: 'password123',
      displayName: 'テストユーザー',
    });

    expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
    expect(authMailService.sendSignUpNotice).toHaveBeenCalledWith(
      'new@example.com',
      'テストユーザー',
    );
  });

  it('signIn 成功時にトークン発行とログイン通知メール送信を行う', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValue(true);

    const tokens = await service.signIn({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(tokens).toEqual({ accessToken: 'token', refreshToken: 'token' });
    expect(authMailService.sendSignInNotice).toHaveBeenCalledWith(
      'user@example.com',
    );
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

  it('refresh でユーザーが存在しない場合は拒否する', async () => {
    jwtService.verify.mockReturnValue({
      sub: 'user-1',
      email: 'old@example.com',
    });
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(service.refresh('refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('refresh でJWT検証に失敗した場合は拒否する', async () => {
    jwtService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(service.refresh('refresh-token')).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
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

  it('同じメールアドレスへの変更を拒否する', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'same@example.com',
      password: 'hashed-password',
    });
    compareMock.mockResolvedValue(true);

    await expect(
      service.changeEmail('user-1', {
        email: 'Same@Example.com',
        currentPassword: 'current-password',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
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

  it('パスワード変更時はハッシュ化して保存する', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      password: 'hashed-password',
    });
    prisma.user.update.mockResolvedValue({ id: 'user-1' });
    compareMock.mockResolvedValue(true);
    const hashMock = bcrypt.hash as jest.Mock<
      Promise<string>,
      [string, number]
    >;
    hashMock.mockResolvedValue('next-hashed-password');

    await expect(
      service.changePassword('user-1', {
        currentPassword: 'current-password',
        newPassword: 'next-password',
      }),
    ).resolves.toBeUndefined();

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { password: 'next-hashed-password' },
    });
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
