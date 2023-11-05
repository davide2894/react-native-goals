import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'this_is_a-super!difficult-pswrd-@2@HACK11!1!!',
    }),
  ],
  providers: [AuthService, PrismaService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
