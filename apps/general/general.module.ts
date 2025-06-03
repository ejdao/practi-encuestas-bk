import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';

export const GEN_MODULES = [AuthModule];

@Module({
  imports: [...GEN_MODULES, SharedModule],
})
export class GeneralModule {}
