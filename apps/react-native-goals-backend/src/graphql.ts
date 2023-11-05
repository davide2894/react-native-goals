
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

export abstract class IQuery {
    abstract hello(): string | Promise<string>;
}

export abstract class IMutation {
    abstract register(email: string, password: string): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;

    abstract login(email: string, password: string): Nullable<AuthPayload> | Promise<Nullable<AuthPayload>>;
}

type Nullable<T> = T | null;
