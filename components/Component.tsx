import { useSession, signIn, signOut } from "next-auth/react"
import {useEffect, useState} from "react";
import {Button, Container, Image, Text} from "@chakra-ui/react";

import {client} from "../lib/hasura/client";

import {
    gql,
} from "@apollo/client";

import { useConnect, useAccount } from "wagmi";

export default function Component() {
    const { data: session } = useSession()
    // @ts-ignore
    const [accessToken, setAccessToken]  = useState<string>("")

    const [{ data, error }, connect] = useConnect()

    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    })

    // if (accountData) {
    //     return (
    //         <Container>
    //             <Image src={accountData.ens?.avatar || '/vercel.svg'} alt="ENS Avatar" />
    //             <Text>
    //                 {accountData.ens?.name
    //                     ? `${accountData.ens?.name} (${accountData.address})`
    //                     : accountData.address}
    //             </Text>
    //             <Text>Connected to {accountData.connector.name}</Text>
    //             <Button onClick={disconnect}>Disconnect</Button>
    //         </Container>
    //     )
    // }
    //
    // return (
    //     <Container>
    //         {data.connectors.map((x) => (
    //             // <Button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
    //             //     {x.name}
    //             //     {!x.ready && ' (unsupported)'}
    //             // </Button>
    //             <Button key={x.id} onClick={() => connect(x)}>
    //                 {x.name}
    //                 {!x.ready && ' (unsupported)'}
    //             </Button>
    //         ))}
    //
    //         {error && <Text>{error?.message ?? 'Failed to connect'}</Text>}
    //     </Container>
    // )

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

    const runUsers = async () => {
        await client
            .query({
                query: gql`
                  query getUsers {
                      users {
                        id
                        last_seen
                        name
                      }
                    }
                `
            })
            .then(result => console.log(result));
    }

    useEffect(() => {
        // console.log("session", session)
        if (session) {
            // @ts-ignore
            setAccessToken(session?.accessToken)
        }
    }, [session])

    if (session) {
        return (
            <>
                Signed in as {session?.user?.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
                <div>Access token: {accessToken || "0"}</div>
                <Button onClick={runqeury}>get tests</Button>
                <Button onClick={runUsers}>get users</Button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button
                onClick={() => signIn()}
            >
                Sign in
            </button>
        </>
    )
}