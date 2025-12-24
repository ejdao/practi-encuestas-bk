import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { STRING_UTILITIES } from '@common/application/services';
import { CTM_CONTEXTS, CtmContexts } from '@common/domain/types';

export class LoginDto {
  @ApiProperty({ example: CTM_CONTEXTS.DEFAULT.getCode() })
  @IsEnum(CtmContexts, {
    message: `Contextos admitidos: ${STRING_UTILITIES.enumToString(CtmContexts)}`,
  })
  context: CtmContexts;

  @ApiProperty({ example: '1234' })
  @IsString()
  username: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  password: string;
}
