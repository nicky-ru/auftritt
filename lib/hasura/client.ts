import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,

} from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

import { getSession } from "next-auth/react"
import {publicConfig} from "../../config/publicConfig";

const httpLink = createHttpLink({
    uri: publicConfig.HASURA_GRAPHQL_API
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

