import { Module } from '@nestjs/common';
import { AuthoritiesSource } from '@common/infrastructure/services';
import { PermisosServicesImpl } from './infrastructure/services';
import {
  PermisosController,
  ModulosController,
  SubModulosController,
  UsuariosController,
  RolesController,
} from './presentation/controllers';
import {
  PermisosCrudSource,
  ModulosCrudSource,
  SubModulosCrudSource,
  UsuarioCrudSource,
  RolCrudSource,
} from './infrastructure/repositories';

@Module({
  controllers: [
    UsuariosController,
    RolesController,
    ModulosController,
    SubModulosController,
    PermisosController,
  ],
  providers: [
    AuthoritiesSource,
    PermisosServicesImpl,
    PermisosCrudSource,
    ModulosCrudSource,
    SubModulosCrudSource,
    UsuarioCrudSource,
    RolCrudSource,
  ],
})
export class SeguridadModule {}
