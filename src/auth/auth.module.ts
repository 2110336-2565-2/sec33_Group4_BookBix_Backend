import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomersModule } from 'src/customers/customers.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { SessionSerializer } from './session.serializer';


@Module({
  imports: [CustomersModule, PassportModule.register({ session: true })],
  providers: [AuthService, LocalStrategy, SessionSerializer]
})
export class AuthModule {}

