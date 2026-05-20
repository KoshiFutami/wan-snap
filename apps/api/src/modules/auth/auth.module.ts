import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { OptionalSupabaseAuthGuard } from '../../common/guards/optional-supabase-auth.guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [SupabaseAuthGuard, OptionalSupabaseAuthGuard],
  exports: [SupabaseAuthGuard, OptionalSupabaseAuthGuard, JwtModule],
})
export class AuthModule {}
