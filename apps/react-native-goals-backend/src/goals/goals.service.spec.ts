import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { GoalsService } from './goals.service';
import { Goal } from '@prisma/client';

describe('GoalsService', () => {
  let goalsService: GoalsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalsService, PrismaService],
    }).compile();

    goalsService = module.get<GoalsService>(GoalsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(goalsService).toBeDefined();
  });

  describe('createDummyUserGoal method', () => {
    it('should create a dummy goal given a user id', async () => {
      const userId = 1;
      const dummyGoal = await goalsService.createDummyUserGoal(1);
      expect(dummyGoal).toBeDefined();
      expect(dummyGoal).toHaveProperty('id');
      expect(dummyGoal).toHaveProperty('title');
      expect(dummyGoal).toHaveProperty('actualScore');
      expect(dummyGoal).toHaveProperty('maxScore');
      expect(dummyGoal).toHaveProperty('minScore');
      expect(dummyGoal).toHaveProperty('timestamp');
      expect(dummyGoal).toHaveProperty('userIdRef');
      expect(dummyGoal.actualScore).toEqual(0);
      expect(dummyGoal.maxScore).toEqual(5);
      expect(dummyGoal.minScore).toEqual(0);
      expect(dummyGoal.userIdRef).toEqual(userId);
    });
  });

  describe('findUserGoals method', () => {
    it('should return user goals', async () => {
      const userId = 1;
      const goals: Array<Goal> = [
        {
          id: 1,
          title: 'Goal 1',
          actualScore: 0,
          maxScore: 5,
          minScore: 0,
          userIdRef: userId,
          timestamp: 1234567890,
        },
      ];
      jest.spyOn(prismaService.goal, 'findMany').mockResolvedValue(goals);
      const result = await goalsService.getUserGoals(userId);
      expect(result).toEqual(goals);
    });
  });

  describe('updateGoalCurrentScore method', () => {
    it('should update the goal current score accordingly', async () => {
      const userId = 1;
      const goalId = 60;
      const newCurrentScore = 4;
      const updatedGoal: Goal = {
        id: goalId,
        title: 'Goal title',
        maxScore: 5,
        minScore: 0,
        actualScore: newCurrentScore,
        userIdRef: userId,
        timestamp: 1234567890,
      };

      jest.spyOn(prismaService.goal, 'update').mockResolvedValue(updatedGoal);

      const result = await goalsService.updateGoalCurrentScore(
        userId,
        goalId,
        newCurrentScore,
      );
      expect(result).toEqual(updatedGoal);
    });
  });

  describe('resetScore method', () => {
    it('should reset the score of a user goal', async () => {
      const userId = 1;
      const goalId = 60;
      const updatedGoal: Goal = {
        id: 60,
        title: 'Goal to update',
        actualScore: 0,
        maxScore: 5,
        minScore: 0,
        userIdRef: userId,
        timestamp: 1234567890,
      };

      jest.spyOn(prismaService.goal, 'update').mockResolvedValue(updatedGoal);

      const result = await goalsService.resetScore(userId, goalId);

      expect(result).toEqual(updatedGoal);
    });
  });

  describe('deleteGoal method', () => {
    it('should delete a user goal', async () => {
      const userId = 1;
      const goalId = 60;

      const deletedGoal: Goal = {
        id: 60,
        title: 'Goal to delete',
        actualScore: 4,
        maxScore: 5,
        minScore: 0,
        userIdRef: userId,
        timestamp: 1234567890,
      };

      jest.spyOn(prismaService.goal, 'delete').mockResolvedValue(deletedGoal);

      const result = await goalsService.deleteGoal(userId, goalId);

      expect(result).toEqual(deletedGoal);
    });
  });

  describe('createGoalmethod method', () => {
    it('should create a new user goal', async () => {
      const userId = 1;
      const newGoalTitle = 'New Goal';
      const newMaxScore = 10;
      const newGoal = {
        id: 60,
        title: newGoalTitle,
        maxScore: newMaxScore,
        minScore: 0,
        actualScore: 0,
        userIdRef: userId,
        timestamp: 1234567890,
      };

      jest.spyOn(prismaService.goal, 'create').mockResolvedValue(newGoal);

      const result = await goalsService.createGoal(
        userId,
        newGoalTitle,
        newMaxScore,
      );

      expect(result).toEqual(newGoal);
    });
  });

  describe('editGoalTitle method', () => {
    it('should edit the title of a user goal', async () => {
      const userId = 1;
      const goalId = 60;
      const goalTitle = 'Updated Goal';
      const updatedGoal = {
        id: goalId,
        title: goalTitle,
        actualScore: 0,
        maxScore: 5,
        minScore: 0,
        userIdRef: userId,
        timestamp: 1234567890,
      };

      jest.spyOn(prismaService.goal, 'update').mockResolvedValue(updatedGoal);

      const result = await goalsService.editGoalTitle(
        goalId,
        userId,
        goalTitle,
      );

      expect(result).toEqual(updatedGoal);
    });
  });
});
