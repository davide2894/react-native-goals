import { CreateUserDto } from './create-user.dto';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { AuthTokensPayload, Goal } from 'src/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
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

  @Query(() => [Goal])
  @UseGuards(JwtAuthGuard)
  async userGoals(@CurrentUser() user: any) {
    console.log('------------------------------------------------');
    console.log('inside user goals  resolver -> userGoals()');
    console.log('user intercepted in request header');
    console.log(user);
    const goals = await this.goalsService.getUserGoals(user?.payload?.id);
    console.log('goals that  are going to be sent to the frontend');
    console.log({ goals });
    return goals;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async incrementScore(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('------------------------------------------------');
    console.log('users.resolvers.ts  --->  incrementScore method');
    console.log(user);
    console.log({ userID: user.payload.id });
    const userInDb = await this.usersService.getUserById(user?.payload.id);
    console.log({ requestVars: req.body.variables });
    console.log({ userInDb });
    console.log({ reqBodyVarsId: req.body.variables.id });
    console.log({
      reqBodyVarNewCurrentScored: req.body.variables.newCurrentScore,
    });
    const updatedGoal = await this.goalsService.updateGoalCurrentScore(
      userInDb.id,
      req.body.variables.id,
      req.body.variables.newCurrentScore,
    );

    console.log({ updatedGoal });

    return updatedGoal;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async decrementScore(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts ---> decrementScore method');
    const userInDb = await this.usersService.getUserById(user?.payload.id);
    const updatedGoal = await this.goalsService.updateGoalCurrentScore(
      userInDb.id,
      req.body.variables.id,
      req.body.variables.newCurrentScore,
    );

    console.log({ updatedGoal });

    return updatedGoal;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async resetScore(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts ---> resetScore method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const updatedGoal = await this.goalsService.resetScore(
      userInDb.id,
      req.body.variables.goalId,
    );

    return updatedGoal;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async deleteGoal(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts ---> deleteGoal method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const updatedGoal = await this.goalsService.deleteGoal(
      userInDb.id,
      req.body.variables.goalId,
    );

    return updatedGoal;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async createGoal(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts--->  createGoal method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const goalTitle = req.body.variables.goalTitle;
    const maxScore = req.body.variables.maxScore;
    return await this.goalsService.createGoal(userInDb.id, goalTitle, maxScore);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async editGoalTitle(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts--->  editGoalTitle method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const goalId = req.body.variables.goalId;
    const goalTitle = req.body.variables.goalTitle;
    return await this.goalsService.editGoalTitle(
      goalId,
      userInDb.id,
      goalTitle,
    );
  }
}
