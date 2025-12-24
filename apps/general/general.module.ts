import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { SeguridadModule } from './seguridad/seguridad.module';

export const SEG_MODULES = [AuthModule, SeguridadModule];

@Module({
  imports: [...SEG_MODULES, SharedModule],
})
export class GeneralModule {}
