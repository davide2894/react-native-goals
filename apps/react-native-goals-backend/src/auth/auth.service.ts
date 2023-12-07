import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AccessTokenPayload, RefreshTokenPayload } from 'src/graphql';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    Logger.log('inside AuthService -> register method');
    Logger.log({ createUserDto });
    Logger.log({ createUserDtoPassword: createUserDto.password });

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = (await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    })) as User;

    Logger.log({ newUser });

    if (!newUser) {
      throw new Error('Registration failed');
    } else {
      return this.createAuthTokens(newUser);
    }
  }

  async login(user: User) {
    console.log('inside auth.serve.ts -> login method ');

    return this.createAuthTokens(user);
  }

  async logInGuest(user: User) {
    console.log('inside  auth.serve.ts -> login method ');

    return this.createAuthTokens(user);
  }

  async createAccessToken(user): Promise<AccessTokenPayload> {
    return {
      access_token: await this.jwtService.signAsync(
        {
          email: user.email,
          id: user.id,
        },
        {
          expiresIn: '10s',
        },
      ),
      email: user.email,
    };
  }

  async createRefreshToken(user): Promise<RefreshTokenPayload> {
    return {
      refresh_token: await this.jwtService.signAsync(
        {
          email: user.email,
          id: user.id,
        },
        {
          expiresIn: '1m',
        },
      ),
      email: user.email,
    };
  }

  async createAuthTokens(user: User): Promise<object> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { accessToken, refreshToken };
  }

  async validateUser(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    console.log('validateUser');
    console.log({ user });

    if (!user || !user.email || !user.password) {
      throw new Error('User not found!');
    }

    //validate password
    const givenPasswordMatches = await bcrypt.compare(
      createUserDto.password,
      user.password,
    );

    if (!givenPasswordMatches) {
      throw new Error('The entered password is invalid');
    }

    return user;
  }
}
