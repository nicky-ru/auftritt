import '../styles/globals.css'
import type { AppProps } from 'next/app'

import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../lib/theme";

import { SessionProvider } from "next-auth/react"

import { Provider as EthHooksProvider } from "wagmi"
import {connectors} from "../lib/web3-provider";

function MyApp({ Component, pageProps: {session, ...pageProps} }: AppProps) {
  return(
      <EthHooksProvider autoConnect connectors={connectors}>
          <SessionProvider session={session}>
              <ChakraProvider theme={theme}>
                  <Component {...pageProps} />
              </ChakraProvider>
          </SessionProvider>
      </EthHooksProvider>
  )
}

export default MyApp
