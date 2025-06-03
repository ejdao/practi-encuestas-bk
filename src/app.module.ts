import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { DATASOURCES } from './app.connections';
import { AuthModule } from '@auth/auth.module';
import { SharedModule } from '@srd/shared.module';

@Module({
  imports: [AuthModule, SharedModule],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    for (let index = 0; index < DATASOURCES.length; index++) {
      const el = DATASOURCES[index];
      const ctxForHumans = el.ctx.getForHumans();
      el.ds
        .initialize()
        .then(() => Logger.log(`${ctxForHumans} inicia correctamente`))
        .catch(err => Logger.log(`${ctxForHumans} no pudo iniciar, detalle: (${err.message})`));
    }
  }
}
