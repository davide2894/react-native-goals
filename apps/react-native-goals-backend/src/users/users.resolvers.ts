import { CreateUserDto } from './create-user.dto';
import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { AuthPayload, Goal } from 'src/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

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

  @Query(() => [Goal])
  async userGoals(@Context('req') req: any) {
    console.log('inside user goals resolver');
    console.log('user intercepted in request header');
    // retrieve all goals associated to the authenticated user
    // const user = await this.usersService.getUserById(req?.user?.id);
    // console.log({ validatedUserById: user });
    const goals = await this.usersService.getUserGoals(req?.user?.payload.id);
    console.log('goals that are going to be sent to the frontend');
    console.log({ goals });
    return goals;
  }

  @Query(() => String)
  async hello(@Context('req') req: any) {
    console.log(
      'users.resolvers.ts ---> hello query resolver --> logging user data',
    );
    console.log({ reqUser: req.user });
    const user = await this.usersService.getUserById(req?.user?.id);
    console.log({ validatedUserById: user });
    return `logged user email is ---> ${req.user.email} and logged user id is ${req.user.id}`;
  }

  // @Mutation()
  // async incrementScore(@Context('req') req: any) {
  //   const user = await this.usersService.getUserById(req?.user?.id);
  //   // const updatedActualScore = await req.goal.updatedActualScore (???);
  //   // const goalToUpdate = await this.usersService.findUserGoal(user.id, req.goal.goalId);
  //   return `incremented goal score for user ${user}`;
  // }
}
