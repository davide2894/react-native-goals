import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    } else {
      return user;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;
    return await this.prismaService.user.create({ data: { email, password } });
  }

  async getUserGoals(id: number) {
    const goals = await this.prismaService.goal.findMany({
      where: {
        userIdRef: id,
      },
    });
    if (!goals.length) {
      console.log(
        `no goals found for user with id ${id}\n proceeding to create a dummy goal`,
      );
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
      goals.push(await this.createDummyUserGoal(id));
    }
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));
    goals.push(await this.createDummyUserGoal(id));

    return goals;
  }

  async createDummyUserGoal(userId: number) {
    console.log(`createDummyUserGoal ---> passed userId is: ${userId}`);
    const goal = await this.prismaService.goal.create({
      data: {
        title: 'test',
        actualScore: 0,
        maxScore: 5,
        minScore: 0,
        timestamp: new Date().getMilliseconds(),
        userIdRef: userId,
      },
    });
    console.log('users.service.ts --> createDummyGoal()');
    console.log('dummy goal created is the following ');
    console.log({ goal });
    return goal;
  }

  async findUserGoal(userId: number, goalId: number) {
    return await this.prismaService.goal.findUnique({
      where: {
        userIdRef: userId,
        id: goalId,
      },
    });
  }
}
