import { useSession, signIn, signOut } from "next-auth/react"
import {useState} from "react";
import {Button, Container, Text} from "@chakra-ui/react";

import {client} from "../lib/hasura/client";

import {
    gql,
} from "@apollo/client";

import {useConnect, useAccount, useNetwork, useSignMessage} from "wagmi";
import { SiweMessage } from 'siwe'

export default function Component() {
    const { data: session } = useSession()

    const [{ data, error }, connect] = useConnect()
    const [ {data : networkData} ] = useNetwork()
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })

    const [, signMessage] = useSignMessage()

    const [state, setState] = useState<{
        address?: string
        error?: Error
        loading?: boolean
    }>({})

    const smartSign = async () => {
        try {
            const address = accountData?.address
            const chainId = networkData?.chain?.id

            if (!address || !chainId) {
                return;
            }

            setState((prevState) => ({...prevState, error: undefined, loading: true}))

            const nonceRes = await fetch('/api/nonce')
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce: await nonceRes.text(),
            })
            const signRes = await signMessage({ message: message.prepareMessage() })
            if (signRes.error) throw signRes.error

            // Sign in with NextAuth
            await signIn('metamask', {
                // name: accountData.ens?.name,
                // image: accountData.ens?.avatar,
                address: address,
                message,
                signature: signRes.data
            })

            setState((prevState) => ({ ...prevState, address, loading: false }))
        } catch (error) {

            console.log(error)
            // @ts-ignore
            setState((prevState) => ({ ...prevState, error, loading: false }))
        }
    }

    const runqeury = async () => {
        await client
            .query({
                query: gql`
                  query GetTests {
                      test {
                        id
                        name
                      }
                    }
                `
            })
            .then(result => console.log(result));
    }

    if (accountData) {
        return (
            <Container>
                {/*<Image src={accountData.ens?.avatar || '/vercel.svg'} alt="ENS Avatar" />*/}
                <Text>
                    {accountData.ens?.name
                        ? `${accountData.ens?.name} (${accountData.address})`
                        : accountData.address}
                </Text>
                <Text>Connected to {accountData?.connector?.name}</Text>
                <Button onClick={disconnect}>Disconnect</Button>

                {session ? (
                    <div>
                        <div>Signed in as {session.address}</div>
                        <Button
                            onClick={async () => {
                                setState({})
                                signOut()
                            }}
                        >
                            Sign Out
                        </Button>
                        <Button onClick={runqeury}>tests</Button>
                    </div>
                ) : (
                    <Button ml={4} disabled={state.loading} onClick={smartSign}>
                        Sign-In with Ethereum
                    </Button>
                )}
            </Container>
        )
    }

    return (
        <Container>
            {data.connectors.map((connector) => (
                <Button key={connector.id} onClick={() => connect(connector)}>
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                </Button>
            ))}

            {error && <Text>{error?.message ?? 'Failed to connect'}</Text>}
        </Container>
    )

    if (session) {
        return (
            <>
                Signed in as {session?.user?.email} <br />

            </>
        )
    }
}