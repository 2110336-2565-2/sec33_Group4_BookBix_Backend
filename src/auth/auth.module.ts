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
import { AdminsModule } from 'src/admins/admins.module';
import { ProvidersModule } from 'src/providers/providers.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    AdminsModule,
    ProvidersModule,
    CustomersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer,
    JwtStrategy,
    JwtAuthService,
  ],
})
export class AuthModule {}
