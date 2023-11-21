import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Goal, User } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async getUserById(id: number): Promise<User | null> {
    console.log({ id });
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
    console.log('user-service.ts --> getUserGoals method');
    console.log({
      userIdRef: id,
    });
    const goals = await this.prismaService.goal.findMany({
      where: {
        userIdRef: id,
      },
    });

    if (!goals.length) {
      goals.push(await this.createDummyUserGoal(id));

      console.log(
        `no goals found for user with id ${id}\n proceeding to create a dummy goal`,
      );
    }
    return goals;
  }

  async createDummyUserGoal(userId: number): Promise<Goal> {
    console.log(`createDummyUserGoal ---> passed userId is: ${userId}`);
    const goal = await this.prismaService.goal.create({
      data: {
        title: `this is a dummy goal for user with id ${userId}`,
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

  async incrementGoalScore(
    userId: number,
    goalId: number,
    newCurrentScore: number,
  ) {
    console.log(
      'user.service.ts ---> incrementGoalScore service method... -->',
    );
    return await this.prismaService.goal.update({
      where: {
        userIdRef: userId,
        id: goalId,
      },
      data: {
        actualScore: newCurrentScore,
      },
    });
  }

  async updateGoalCurrentScore(
    userId: number,
    goalId: number,
    newCurrentScore: number,
  ) {
    console.log(
      'user.service.ts ---> incrementGoalScore service method... -->',
    );
    return await this.prismaService.goal.update({
      where: {
        userIdRef: userId,
        id: goalId,
      },
      data: {
        actualScore: newCurrentScore,
      },
    });
  }

  async resetScore(userId: number, goalId: number) {
    console.log('user.service.ts ---> resetScore service method... -->');
    return await this.prismaService.goal.update({
      where: {
        userIdRef: userId,
        id: goalId,
      },
      data: {
        actualScore: 0,
      },
    });
  }
  async deleteGoal(userId: number, goalId: number) {
    console.log('user.service.ts ---> deleteGoal service method... -->');
    return await this.prismaService.goal.delete({
      where: {
        userIdRef: userId,
        id: goalId,
      },
    });
  }

  async createGoal(
    userId: number,
    goalTitle: string,
    maxScore: number,
  ): Promise<Goal> {
    console.log('user.service.ts ---> createGoal service method... -->');
    const goal = await this.prismaService.goal.create({
      data: {
        title: goalTitle,
        userIdRef: userId,
        maxScore: maxScore,
        minScore: 0,
        actualScore: 0,
        timestamp: new Date().getMilliseconds(),
      },
    });

    console.log('created goal successfully');
    console.log({ createdGoal: goal });
    return goal;
  }

  async editGoalTitle(goalId: number, userId: number, goalTitle: string) {
    return await this.prismaService.goal.update({
      where: {
        id: goalId,
        userIdRef: userId,
      },
      data: {
        title: goalTitle,
      },
    });
  }
}
