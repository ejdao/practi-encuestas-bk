import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Get, Controller, Param, Post, Body, BadRequestException } from '@nestjs/common';
import { FetchPermisoRes, OnlyIdFromEntityRes } from '@gen/seguridad/application/responses';
import { PermisosCrudSource } from '@gen/seguridad/infrastructure/repositories';
import { PermisosServicesImpl } from '@gen/seguridad/infrastructure/services';
import { Authorities, CommonGuards } from '@common/presentation/decorators';
import { CreatePermisoDto } from '@gen/seguridad/application/dtos';
import { GEN_AUTHORITIES } from '@authorities/general';
import { PermisoOrm } from '@orm/general/seguridad';

@ApiTags('V1 | Permisos')
@CommonGuards()
@Controller('v1/gen/permisos')
export class PermisosController {
  constructor(
    private _crud: PermisosCrudSource,
    private _services: PermisosServicesImpl
  ) {}

  @ApiOkResponse({ type: FetchPermisoRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get()
  async fetch(): Promise<FetchPermisoRes> {
    try {
      return await this._crud.fetch();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: OnlyIdFromEntityRes })
  @Authorities()
  @Post()
  async create(@Body() body: CreatePermisoDto): Promise<OnlyIdFromEntityRes> {
    try {
      return await this._crud.create(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: FetchPermisoRes })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get('by-usuario/:id')
  public async fetchByUsuario(@Param('id') id: string): Promise<FetchPermisoRes> {
    try {
      return this._services.fetchByUsuario(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get('add-permiso-to-usuario/:permisoId/:usuarioId')
  async addPermisoToUsuario(
    @Param('permisoId') permisoId: string,
    @Param('usuarioId') usuarioId: string
  ): Promise<boolean> {
    try {
      return this._services.addPermisoToUsuario(permisoId, usuarioId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get('remove-permiso-to-usuario/:permisoId/:usuarioId')
  async removePermisoToUsuario(
    @Param('permisoId') permisoId: string,
    @Param('usuarioId') usuarioId: string
  ): Promise<boolean> {
    try {
      return this._services.removePermisoToUsuario(permisoId, usuarioId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get('add-permiso-to-rol/:permisoId/:rolId')
  async addPermisoToRol(
    @Param('permisoId') permisoId: string,
    @Param('rolId') rolId: string
  ): Promise<boolean> {
    try {
      return this._services.addPermisoToRol(permisoId, rolId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiOkResponse({ type: Boolean })
  @Authorities([GEN_AUTHORITIES.SEGURIDAD.GESTIONAR_PERMISOS_USUARIO_ROL])
  @Get('remove-permiso-to-rol/:permisoId/:rolId')
  async removePermisoToRol(
    @Param('permisoId') permisoId: string,
    @Param('rolId') rolId: string
  ): Promise<boolean> {
    try {
      return this._services.removePermisoToRol(permisoId, rolId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
