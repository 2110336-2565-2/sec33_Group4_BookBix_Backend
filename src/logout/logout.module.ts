import { Module } from '@nestjs/common';
import { LogoutController } from './logout.controller';

@Module({
  controllers: [LogoutController]
})
export class LogoutModule {}
