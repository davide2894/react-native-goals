import { CreateUserDto } from './create-user.dto';
import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { Goal } from 'src/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Query(() => [Goal])
  async userGoals(@Context('req') req: any) {
    console.log('inside user goals resolver');
    console.log('user intercepted in request header');
    const goals = await this.usersService.getUserGoals(req?.user?.payload.id);
    console.log('goals  that are going to be sent to the frontend');
    console.log({ goals });
    return goals;
  }

  @Query(() => String)
  async hello(@Context('req') req: any) {
    console.log({ req });
    return `hello`;
  }

  @Mutation()
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<object> {
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
  ): Promise<object> {
    const createUserDto: CreateUserDto = { email, password };
    const validatedUser = await this.authService.validateUser(createUserDto);
    if (validatedUser) {
      console.log({ validatedUser });
      const loggedUser = await this.authService.login(validatedUser);
      console.log({ loggedUser });
      return loggedUser;
    }
  }

  @Mutation()
  async refreshTokens(@Context('req') req: any): Promise<object> {
    const user = await this.usersService.getUserById(req?.user?.payload.id);
    const authTokens = await this.authService.createAuthTokens(user);

    return authTokens;
  }

  @Mutation()
  async createAuthTokens(user) {
    return await this.authService.createAuthTokens(user);
  }

  @Mutation()
  async incrementScore(@Context('req') req: any) {
    console.log('users.resolvers.ts ---> incrementScore method');
    console.log({ userFromReq: req?.user?.payload?.id });
    const user = await this.usersService.getUserById(req?.user?.payload.id);
    console.log({ requestVars: req.body.variables });
    const updatedGoal = await this.usersService.updateGoalCurrentScore(
      user.id,
      req.body.variables.id,
      req.body.variables.newCurrentScore,
    );

    console.log({ updatedGoal });

    return updatedGoal;
  }

  @Mutation()
  async decrementScore(@Context('req') req: any) {
    console.log('users.resolvers.ts ---> decrementScore method');
    const user = await this.usersService.getUserById(req?.user?.payload.id);
    const updatedGoal = await this.usersService.updateGoalCurrentScore(
      user.id,
      req.body.variables.id,
      req.body.variables.newCurrentScore,
    );

    return updatedGoal;
  }

  @Mutation()
  async resetScore(@Context('req') req: any) {
    console.log('users.resolvers.ts ---> resetScore method');
    const user = await this.usersService.getUserById(req?.user?.payload?.id);
    const updatedGoal = await this.usersService.resetScore(
      user.id,
      req.body.variables.goalId,
    );

    return updatedGoal;
  }

  @Mutation()
  async deleteGoal(@Context('req') req: any) {
    console.log('users.resolvers.ts ---> deleteGoal method');
    const user = await this.usersService.getUserById(req?.user?.payload?.id);
    const updatedGoal = await this.usersService.deleteGoal(
      user.id,
      req.body.variables.goalId,
    );

    return updatedGoal;
  }

  @Mutation()
  async createGoal(@Context('req') req: any) {
    console.log('users.resolvers.ts--->  createGoal method');
    const user = await this.usersService.getUserById(req?.user?.payload?.id);
    const goalTitle = req.body.variables.goalTitle;
    const maxScore = req.body.variables.maxScore;
    return await this.usersService.createGoal(user.id, goalTitle, maxScore);
  }

  @Mutation()
  async editGoalTitle(@Context('req') req: any) {
    console.log('users.resolvers.ts--->  editGoalTitle method');
    const user = await this.usersService.getUserById(req?.user?.payload?.id);
    const goalId = req.body.variables.goalId;
    const goalTitle = req.body.variables.goalTitle;
    return await this.usersService.editGoalTitle(goalId, user.id, goalTitle);
  }
}
