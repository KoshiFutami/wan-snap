import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthMailService } from './auth-mail.service';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, AuthMailService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
