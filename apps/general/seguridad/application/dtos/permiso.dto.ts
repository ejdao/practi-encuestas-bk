import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  moduloId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subModuloId: string;
}
