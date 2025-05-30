import { Module, OnModuleInit } from '@nestjs/common';
import { initializeSources } from './app.connections';

@Module({
  imports: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    initializeSources();
  }
}
