import { Module, OnModuleInit } from '@nestjs/common';
import { initializeSources } from './app.connections';
import { SharedModule } from '@srd/shared.module';

@Module({
  imports: [SharedModule],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    initializeSources();
  }
}
