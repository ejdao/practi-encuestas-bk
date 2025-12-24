import { Module } from '@nestjs/common';
import { AuthTkRqController } from './presentation/controllers';
import { LoginUserImpl, AuthServicesImpl } from './infrastructure/services';
import { AuthTkUrqController } from './presentation/controllers/auth.unrequired-token.controller';

@Module({
  controllers: [AuthTkUrqController, AuthTkRqController],
  providers: [LoginUserImpl, AuthServicesImpl],
})
export class AuthModule {}
