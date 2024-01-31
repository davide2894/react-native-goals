import { Goal } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { devModeLog } from 'dev-mode-log';

@Injectable()
export class GoalsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserGoals(id: number) {
    devModeLog('user-service.ts --> getUserGoals method');
    devModeLog({
      userIdRef: id,
    });
    const goals = await this.prismaService.goal.findMany({
      where: {
        userIdRef: id,
      },
    });

    if (!goals.length) {
      goals.push(await this.createDummyUserGoal(id));

      devModeLog(
        `no goals found for user with id ${id}\n proceeding to create a dummy goal`,
      );
    }
    return goals;
  }

  async createDummyUserGoal(userId: number): Promise<Goal> {
    devModeLog(`createDummyUserGoal ---> passed userId is: ${userId}`);
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
    devModeLog('users.service.ts --> createDummyGoal()');
    devModeLog('dummy goal created is the following ');
    devModeLog({ goal });
    return goal;
  }

  async updateGoalCurrentScore(
    userId: number,
    goalId: number,
    newCurrentScore: number,
  ) {
    devModeLog(
      'user.service.ts ---> updateGoalCurrentScore service method... -->',
    );
    devModeLog({
      userId,
      goalId,
      newCurrentScore,
    });
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
    devModeLog('user.service.ts ---> resetScore service method... -->');
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
    devModeLog('user.service.ts ---> deleteGoal service method... -->');
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
    devModeLog('user.service.ts ---> createGoal service method... -->');
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

    devModeLog('created goal successfully');
    devModeLog({ createdGoal: goal });
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
