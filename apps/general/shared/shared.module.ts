import { Module } from '@nestjs/common';
import { UbicacionModule } from './ubicacion/ubicacion.module';

export const SRD_MODULES = [UbicacionModule];

@Module({
  imports: SRD_MODULES,
})
export class SharedModule {}
