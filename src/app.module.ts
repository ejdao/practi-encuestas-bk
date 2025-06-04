import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { GeneralModule } from '@gen/general.module';
import { DATASOURCES } from './app.connections';

@Module({
  imports: [GeneralModule],
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
