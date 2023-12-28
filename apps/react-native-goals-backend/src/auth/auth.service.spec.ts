import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/create-user.dto';
import { User } from '@prisma/client';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  const email = 'test12abc3@example.com';
  const password = 'password123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prismaService.user.deleteMany({
      where: {
        email,
      },
    });

    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and return a new set of auth tokens', async () => {
      const createUserDto: CreateUserDto = {
        email,
        password,
      };

      const registrationResult = await authService.register(createUserDto);

      expect(registrationResult).toHaveProperty('access_token');
      expect(registrationResult.access_token).toBeDefined();
      expect(registrationResult).toHaveProperty('refresh_token');
      expect(registrationResult.refresh_token).toBeDefined();
    });
  });

  describe('auth tokens', () => {
    it('should be able to create an access token given an user', async () => {
      const user = {
        email,
        password,
        id: 1,
      } as User;

      const accessTokenResult = await authService.createAccessToken(user);
      expect(accessTokenResult).toBeDefined();
      expect(accessTokenResult).toBeTruthy();
    });

    it('should be able to create a refresh token given an user', async () => {
      const user = {
        email,
        password,
        id: 1,
      } as User;

      const accessTokenResult = await authService.createRefreshToken(user);
      expect(accessTokenResult).toBeDefined();
      expect(accessTokenResult).toBeTruthy();
    });
  });
});
