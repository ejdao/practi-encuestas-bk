import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { CTM_LOGIC_CONTEXTS_VALUES, CtmContextType } from '@common/domain/types';
import { LoginUserImpl } from '@auth/infrastructure/services';
import { CtmTypeRes } from '@common/application/responses';
import { LoginRes } from '@auth/application/responses';
import { LoginDto } from '@auth/application/dtos';

@ApiTags('V1 | Autenticación')
@Controller('v1/auth')
export class AuthTkUrqController {
  constructor(private _login: LoginUserImpl) {}

  @ApiResponse({ type: CtmTypeRes })
  @Get('contextos')
  public async fetchContexts(): Promise<CtmContextType[]> {
    return CTM_LOGIC_CONTEXTS_VALUES;
  }

  @Post('login')
  @ApiOkResponse({ type: LoginRes })
  public async login(@Body() payload: LoginDto): Promise<LoginRes> {
    try {
      return this._login.execute(payload);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
