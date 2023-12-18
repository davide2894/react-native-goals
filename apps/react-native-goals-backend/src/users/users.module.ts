import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserResolver } from './users.resolvers';
import { AuthModule } from '../auth/auth.module';
import { GoalsService } from '../goals/goals.service';
import { GoalsResolver } from '../goals/goals.resolver';

@Module({
  imports: [AuthModule],
  providers: [
    UsersService,
    GoalsService,
    PrismaService,
    UserResolver,
    GoalsResolver,
  ],
})
export class UsersModule {}
