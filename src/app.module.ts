import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from 'dotenv';
import { LogoutModule } from './logout/logout.module';
config();

@Module({
  imports: [LogoutModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
