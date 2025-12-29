import { Module } from '@nestjs/common';
import { RecursosController } from './presentation/controllers';
import { FetchEpsImpl } from './infrastructure/services';

@Module({
  controllers: [RecursosController],
  providers: [FetchEpsImpl],
})
export class GeneralModule {}
