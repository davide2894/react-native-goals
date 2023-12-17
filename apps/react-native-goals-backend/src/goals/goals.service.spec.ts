import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { GoalsService } from './goals.service';

describe('GoalsService', () => {
  let goalsService: GoalsService;
  // let prismaService: PrismaService;
  // let jwtSercie: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalsService, PrismaService, JwtService],
    }).compile();

    goalsService = module.get<GoalsService>(GoalsService);
  });

  it('should be defined', () => {
    expect(goalsService).toBeDefined();
  });

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
