import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SeguridadModule } from './seguridad/seguridad.module';

export const SEG_MODULES = [AuthModule, SeguridadModule];

@Module({
  imports: [...SEG_MODULES],
})
export class GeneralModule {}
