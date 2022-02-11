import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,

} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import { getSession } from "next-auth/react"

const httpLink = createHttpLink({
    uri: 'https://halodashv2.hasura.app/v1/graphql'
});

const authLink = setContext( async (_, { headers }) => {
    // @ts-ignore
    const {token} = await getSession()
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink)
});

