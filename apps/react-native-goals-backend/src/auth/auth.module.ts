import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [JwtModule.register({})],
  providers: [AuthService, PrismaService, JwtStrategy, JwtRefreshStrategy],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
