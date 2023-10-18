
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

export abstract class IQuery {
    abstract hello(): string | Promise<string>;
}

export abstract class IMutation {
    abstract register(email: string, password: string): Nullable<User> | Promise<Nullable<User>>;

    abstract login(email: string, password: string): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
