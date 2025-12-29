import { Module } from '@nestjs/common';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { GeneralModule } from './general/general.module';

export const SRD_MODULES = [UbicacionModule, GeneralModule];

@Module({
  imports: SRD_MODULES,
})
export class SharedModule {}
