import { CreateUserDto } from './create-user.dto';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { AuthTokensPayload } from 'src/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/currentUser.decoratos';
import { JwtRefreshAuthGuard } from 'src/guards/jwt-refresh-auth.guard';
import { GoalsService } from 'src/goals/goals.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private goalsService: GoalsService,
  ) {}

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<AuthTokensPayload> {
    console.log('inside UserResolver -> register method ');
    console.log({
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
  ): Promise<object> {
    console.log('resolvers .ts LOGIN ');
    const createUserDto: CreateUserDto = { email, password };
    const validatedUser = await this.authService.validateUser(createUserDto);
    if (validatedUser) {
      console.log({ validatedUser });
      return await this.authService.login(validatedUser);
    }
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Mutation()
  async refreshTokens(@CurrentUser() user: any): Promise<object> {
    console.log('inside refreshTokens resolver  ');
    const userInDb = await this.usersService.getUserById(user?.payload.id);
    const authTokens = await this.authService.createAuthTokens(userInDb);
    console.log('new tokens');
    console.log({ authTokens });
    return authTokens;
  }
}
