import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../infrastructure/database/prisma.module';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { OptionalSupabaseAuthGuard } from '../../common/guards/optional-supabase-auth.guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [SupabaseAuthGuard, OptionalSupabaseAuthGuard],
  exports: [SupabaseAuthGuard, OptionalSupabaseAuthGuard],
})
export class AuthModule {}
