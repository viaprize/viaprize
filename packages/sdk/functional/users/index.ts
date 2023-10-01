/**
 * @packageDocumentation
 * @module api.functional.users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, IPropagation, Primitive } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";

import type { CreateUser } from "../../../../backend/src/users/dto/create-user.dto";
import type { User } from "../../../../backend/src/users/entities/user.entity";

/**
 * Creates a new user and sends welcome email.
 *
 * @see {
 * @link MailService }
 * @returns The created user object.
 *
 * @controller UsersController.create
 * @path POST /users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function create(
  connection: IConnection,
  createUserDto: create.Input,
): Promise<create.Output> {
  return PlainFetcher.propagate(
    {
      ...connection,
      headers: {
        ...(connection.headers ?? {}),
        "Content-Type": "application/json",
      },
    },
    {
      ...create.METADATA,
      path: create.path(),
    } as const,
    createUserDto,
  );
}
export namespace create {
  export type Input = Primitive<CreateUser>;
  export type Output = IPropagation<{
    201: User;
  }>;

  export const METADATA = {
    method: "POST",
    path: "/users",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (): string => {
    return `/users`;
  };
}

/**
 * Get a user by ID.
 *
 * @returns The user object.
 *
 * @controller UsersController.findOne
 * @path GET /users/:authId
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function findOne(
  connection: IConnection,
  userId: string,
): Promise<findOne.Output> {
  return PlainFetcher.propagate(connection, {
    ...findOne.METADATA,
    path: findOne.path(userId),
  } as const);
}
export namespace findOne {
  export type Output = IPropagation<{
    200: User;
  }>;

  export const METADATA = {
    method: "GET",
    path: "/users/:authId",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (userId: string): string => {
    return `/users/${encodeURIComponent(userId ?? "null")}`;
  };
}
