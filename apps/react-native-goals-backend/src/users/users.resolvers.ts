import { CreateUserDto } from './create-user.dto';
import { Logger } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { AuthTokensPayload, Goal } from 'src/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/currentUser.decoratos';

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
  ): Promise<AuthTokensPayload> {
    Logger.log('inside UserResolver -> register method ');
    Logger.log({
      email,
      password,
    });
    const createUserDto: CreateUserDto = { email, password };
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<object> {
    console.log('resolvers.ts LOGIN');
    const createUserDto: CreateUserDto = { email, password };
    const validatedUser = await this.authService.validateUser(createUserDto);
    if (validatedUser) {
      console.log({ validatedUser });
      const loggedUser = await this.authService.login(validatedUser);
      console.log({ loggedUser });
      return loggedUser;
    }
  }

  @UseGuards(JwtAuthGuard)
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
    const goals = await this.usersService.getUserGoals(user?.payload?.id);
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
    const updatedGoal = await this.usersService.updateGoalCurrentScore(
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
    const updatedGoal = await this.usersService.updateGoalCurrentScore(
      userInDb.id,
      req.body.variables.id,
      req.body.variables.newCurrentScore,
    );

    return updatedGoal;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async resetScore(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts ---> resetScore method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const updatedGoal = await this.usersService.resetScore(
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
    const updatedGoal = await this.usersService.deleteGoal(
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
    return await this.usersService.createGoal(userInDb.id, goalTitle, maxScore);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation()
  async editGoalTitle(@CurrentUser() user: any, @Context('req') req: any) {
    console.log('users.resolvers.ts--->  editGoalTitle method');
    const userInDb = await this.usersService.getUserById(user?.payload?.id);
    const goalId = req.body.variables.goalId;
    const goalTitle = req.body.variables.goalTitle;
    return await this.usersService.editGoalTitle(
      goalId,
      userInDb.id,
      goalTitle,
    );
  }
}
