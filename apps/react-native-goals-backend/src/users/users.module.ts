import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './users.resolvers';
import { AuthModule } from 'src/auth/auth.module';
import { GoalsService } from 'src/goals/goals.service';

@Module({
  imports: [AuthModule],
  providers: [UsersService, GoalsService, PrismaService, UserResolver],
})
export class UsersModule {}
