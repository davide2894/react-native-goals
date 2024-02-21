
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class GoalScoreInput {
    id?: Nullable<number>;
    newCurrentScore?: Nullable<number>;
}

export class User {
    id?: Nullable<number>;
    email?: Nullable<string>;
}

export class AccessTokenPayload {
    access_token?: Nullable<string>;
}

export class RefreshTokenPayload {
    refresh_token?: Nullable<string>;
}

export class AuthTokensPayload {
    access_token?: Nullable<string>;
    refresh_token?: Nullable<string>;
}

export class Goal {
    id?: Nullable<number>;
    title?: Nullable<string>;
    maxScore?: Nullable<number>;
    minScore?: Nullable<number>;
    actualScore?: Nullable<number>;
    userIdRef?: Nullable<number>;
    timestamp?: Nullable<number>;
    user?: Nullable<User>;
}

export abstract class IQuery {
    abstract userGoals(): Nullable<Nullable<Goal>[]> | Promise<Nullable<Nullable<Goal>[]>>;

    abstract hello(): Nullable<string> | Promise<Nullable<string>>;
}

export abstract class IMutation {
    abstract register(email: string, password: string): Nullable<AuthTokensPayload> | Promise<Nullable<AuthTokensPayload>>;

    abstract login(email: string, password: string): Nullable<AuthTokensPayload> | Promise<Nullable<AuthTokensPayload>>;

    abstract refreshTokens(access_token: string, refresh_token: string): Nullable<AuthTokensPayload> | Promise<Nullable<AuthTokensPayload>>;

    abstract incrementScore(inputStuff?: Nullable<GoalScoreInput>): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract decrementScore(inputStuff?: Nullable<GoalScoreInput>): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract resetScore(goalId: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract deleteGoal(goalId: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract createGoal(goalTitle: string, maxScore: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract editGoalTitle(goalId?: Nullable<number>, goalTitle?: Nullable<string>): Nullable<Goal> | Promise<Nullable<Goal>>;
}

type Nullable<T> = T | null;
