
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

export class AuthPayload {
    access_token: string;
    email: string;
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
    abstract hello(): string | Promise<string>;

    abstract userGoals(): Nullable<Nullable<Goal>[]> | Promise<Nullable<Nullable<Goal>[]>>;
}

export abstract class IMutation {
    abstract register(email: string, password: string): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract login(email: string, password: string): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract continueAsGuest(email: string, password: string): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract incrementScore(inputStuff?: Nullable<GoalScoreInput>): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract decrementScore(inputStuff?: Nullable<GoalScoreInput>): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract resetScore(goalId: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract deleteGoal(goalId: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract createGoal(goalTitle: string, maxScore: number): Nullable<Goal> | Promise<Nullable<Goal>>;

    abstract editGoalTitle(goalId?: Nullable<number>, goalTitle?: Nullable<string>): Nullable<Goal> | Promise<Nullable<Goal>>;
}

type Nullable<T> = T | null;
