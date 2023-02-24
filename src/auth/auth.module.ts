import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CustomersModule } from 'src/customers/customers.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthService } from './jwt.service';

@Module({
  imports: [
    CustomersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    JwtStrategy,
    JwtAuthService,
  ],
})
export class AuthModule {}
