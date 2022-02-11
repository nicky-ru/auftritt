import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../lib/theme";

import { SessionProvider } from "next-auth/react"

import { Provider as EthHooksProvider } from "wagmi"
import {connectors} from "../lib/web3-provider";

import {
    ApolloProvider,
} from "@apollo/client";
import {client} from "../lib/hasura/client";

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return(
      <EthHooksProvider autoConnect connectors={connectors}>
          <SessionProvider session={session}>
              <ChakraProvider theme={theme}>
                  <ApolloProvider client={client}>
                      <Component {...pageProps} />
                  </ApolloProvider>
              </ChakraProvider>
          </SessionProvider>
      </EthHooksProvider>
  )
}

export default MyApp
