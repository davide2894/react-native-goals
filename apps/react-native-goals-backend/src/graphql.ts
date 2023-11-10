
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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
}

type Nullable<T> = T | null;
