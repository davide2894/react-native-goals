import { CreateUserDto } from './create-user.dto';
import { User } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { AuthPayload } from 'src/graphql';

@Resolver('User')
export class UserResolver {
  constructor(private authService: AuthService) {}

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    Logger.log('inside UserResolver -> register method');
    Logger.log({
      email,
      password,
    });
    const createUserDto: CreateUserDto = { email, password };
    return await this.authService.register(createUserDto);
  }

  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthPayload> {
    const createUserDto: CreateUserDto = { email, password };
    const validatedUser = await this.authService.validateUser(createUserDto);
    if (validatedUser) {
      console.log({ validatedUser });
      const loggedUser = await this.authService.login(validatedUser);
      console.log({ loggedUser });
      return loggedUser;
    }
  }
}
