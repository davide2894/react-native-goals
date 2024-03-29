import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthTokensPayload } from 'src/graphql';
import { devModeLog } from 'dev-mode-log';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    devModeLog('inside AuthService -> register method');
    devModeLog({ createUserDto });
    devModeLog({ createUserDtoPassword: createUserDto.password });

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = (await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    })) as User;

    devModeLog({ newUser });

    if (!newUser) {
      throw new Error('Registration failed');
    } else {
      devModeLog('creating auth tokens');
      const authTokens = await this.createAuthTokens(newUser);
      devModeLog({ authTokens });
      return authTokens;
    }
  }

  async login(user: User) {
    devModeLog('inside auth.serve.ts ->  login method ');
    const authTokens = await this.createAuthTokens(user);
    devModeLog({ authTokens });
    return authTokens;
  }

  async createAccessToken(user): Promise<string> {
    return await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      {
        expiresIn: '30m',
        secret: process.env.ACCESS_TOKEN_SECRET,
      },
    );
  }

  async createRefreshToken(user): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      {
        email: user.email,
        id: user.id,
      },
      {
        expiresIn: '24h',
        secret: process.env.REFRESH_TOKEN_SECRET,
      },
    );
    return refreshToken;
  }

  async createAuthTokens(user: User): Promise<AuthTokensPayload> {
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async validateUser(createUserDto: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    devModeLog('validateUser');
    devModeLog({ user });

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
