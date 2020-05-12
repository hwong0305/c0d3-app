import withApollo from 'next-with-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-boost'

const link = createHttpLink({
  uri: '/api/graphql',
  credentials: 'include'
})

export default withApollo(
  ({ initialState }) =>
    new ApolloClient({
      // Cache is used to rehydrating the store for Server Side Rendering.
      // Apollo Explanation https://www.apollographql.com/docs/react/performance/server-side-rendering/
      // Example from : https://medium.com/swlh/create-a-killer-frontend-for-2020-setup-next-js-graphql-styled-components-typescript-and-ssr-fe66cffd7d94
      cache: new InMemoryCache().restore(initialState || {}),
      link
    })
)
