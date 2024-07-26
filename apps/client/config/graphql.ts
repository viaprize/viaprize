/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { env } from '@env';

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const httpLink = new HttpLink({
  uri: env.NEXT_PUBLIC_GITCOIN_GRAPHQL,
});

export const logLink = new ApolloLink((operation, forward) => {
  console.log(`GraphQL Request: ${operation.operationName}`);
  console.log('Variables:', operation.variables);
  console.log('Query:', operation.query.loc?.source.body);

  return forward(operation).map((response) => {
    console.log(`GraphQL Response: ${operation.operationName}`);
    console.log('Response:', response);
    return response;
  });
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

export const gitcoinGraphClient = new ApolloClient({
  link: ApolloLink.from([errorLink, logLink, httpLink]),
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

gitcoinGraphClient.clearStore();
