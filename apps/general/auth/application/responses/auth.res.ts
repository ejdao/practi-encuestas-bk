import { ApiProperty } from '@nestjs/swagger';

export class LoginRes {
  @ApiProperty()
  token: string;
}

export class MyAuthDataRes {
  @ApiProperty()
  documento: string;

  @ApiProperty()
  nombreCompleto: string;

  @ApiProperty()
  permisos: string[];
}
