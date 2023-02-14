import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from "./customers/services/email.module";
@Module({
  imports: [
    AuthModule,
    CustomersModule,
    EmailModule,
    MongooseModule.forRoot(
      //database url string
      process.env.MONGODB_DBURL,
    ),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
