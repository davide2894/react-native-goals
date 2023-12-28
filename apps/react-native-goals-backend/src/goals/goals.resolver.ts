import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Context, Query } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/currentUser.decoratos';
import { Goal } from 'src/graphql';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';
import { GoalsService } from './goals.service';

@Resolver('Goals')
export class GoalsResolver {
  constructor(
    private usersService: UsersService,
    private goalsService: GoalsService,
  ) {}

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
