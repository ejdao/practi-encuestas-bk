import { CtmTypeRes, UsuarioBasicoRes } from '@common/application/responses';
import { ParentezcoType } from '@ctypes/encuestas';
import { TipoDocUsuarioType } from '@ctypes/general/usuario';
import { ApiProperty } from '@nestjs/swagger';

export class OpcionRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  orden: number;

  @ApiProperty()
  nombre: string;
}

export class PreguntaRes {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: CtmTypeRes })
  tipo: CtmTypeRes;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty({ type: OpcionRes, isArray: true })
  opciones: OpcionRes[];

  @ApiProperty({ type: PreguntaRes, isArray: true })
  complemento: PreguntaRes[];

  @ApiProperty()
  isOpcional: boolean;

  @ApiProperty()
  limSelMultiOrCarac: number;

  @ApiProperty()
  preguntaClaveId: number;

  @ApiProperty()
  opcionClaveId: number;
}

export class GenerateEncuestaRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombre: string;

  @ApiProperty({ type: PreguntaRes, isArray: true })
  preguntas: PreguntaRes[];
}

export class EncuestadoRes {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nombreCompleto: string;

  @ApiProperty({ type: CtmTypeRes })
  tipoDocumento: TipoDocUsuarioType;

  @ApiProperty()
  numeroDocumento: string;

  @ApiProperty()
  tieneLibretaMilitar: boolean;

  @ApiProperty()
  direccion: string;

  @ApiProperty({ type: CtmTypeRes })
  parentezco: ParentezcoType;

  @ApiProperty({ type: EncuestadoRes })
  jefeHogar: EncuestadoRes;

  @ApiProperty({ type: UsuarioBasicoRes })
  creadoPor: UsuarioBasicoRes;

  @ApiProperty()
  fechaCreacion: Date;

  @ApiProperty()
  cantViviendasPropias: number;

  @ApiProperty()
  cantFamiliares: number;
}
