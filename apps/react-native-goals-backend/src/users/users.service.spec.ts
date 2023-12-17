import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './create-user.dto';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaService: PrismaService;
  const email = 'testExample123@example.com';
  const password = 'password123test';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        email,
      },
    });
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('method getUserById', () => {
    it('should be able to find user in DB, given an user id', async () => {
      const createUserDto: CreateUserDto = {
        email,
        password,
      };

      const newUser = (await prismaService.user.create({
        data: {
          email: createUserDto.email,
          password: password,
        },
      })) as User;

      const queryResult = await prismaService.user.findUnique({
        where: {
          id: newUser.id,
        },
      });

      console.log({ queryResult });
      expect(queryResult).toBeDefined();
      expect(queryResult).toHaveProperty('email');
    });
  });
});
