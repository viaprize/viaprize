/**
 * @packageDocumentation
 * @module api.functional.prizes.proposals.user
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection, IPropagation, Resolved } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";

import type { PrzieQuery } from "../../../../../../backend/src/prizes/prizes.controller";
import type { __type } from "../../../../../../backend/src/utils/types/infinity-pagination-result.type";

/**
 * Get pending proposal of user
 *
 * @date 9/25/2023 - 4:47:51 AM
 * @summary Get pending proposals,
 * @async
 * @param query
 * @param userId
 * @returns
 *
 * @controller PrizesController.getProposalsBy
 * @path GET /prizes/proposals/user/:userId
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function getProposalsBy(
  connection: IConnection,
  query: getProposalsBy.Query,
  userId: string,
): Promise<getProposalsBy.Output> {
  return PlainFetcher.propagate(connection, {
    ...getProposalsBy.METADATA,
    path: getProposalsBy.path(userId, query),
  } as const);
}
export namespace getProposalsBy {
  export type Query = Resolved<PrzieQuery>;
  export type Output = IPropagation<{
    200: Readonly<__type>;
  }>;

  export const METADATA = {
    method: "GET",
    path: "/prizes/proposals/user/:userId",
    request: null,
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: null,
  } as const;

  export const path = (userId: string, query: getProposalsBy.Query): string => {
    const variables: Record<any, any> = query as any;
    const search: URLSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(variables))
      if (value === undefined) continue;
      else if (Array.isArray(value))
        value.forEach((elem) => search.append(key, String(elem)));
      else search.set(key, String(value));
    const encoded: string = search.toString();
    return `/prizes/proposals/user/${encodeURIComponent(userId ?? "null")}${
      encoded.length ? `?${encoded}` : ""
    }`;
  };
}
