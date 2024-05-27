import { ApolloClient, InMemoryCache } from '@apollo/client';
import { env } from '@env';

export const gitcoinGraphClient = new ApolloClient({
  uri: env.NEXT_PUBLIC_GITCOIN_GRAPHQL,
  cache: new InMemoryCache(),
});
