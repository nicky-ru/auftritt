import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// @ts-ignore
import { sign, verify } from 'jsonwebtoken'
import {publicConfig} from "../../../config/publicConfig";

export default NextAuth({
    pages: {
        // signIn: '/auth/signin',
    },
    providers: [
        CredentialsProvider({
            id: 'metamask',
            name: 'Metamask',
            credentials: {
                // name: { label: "nickname", type: "text"},
                // email: { label: "email", type: "email"},
                // image: { label: "image", type: "text"},
                address: { label: "Address", type: "text"},
                message: { label: "Message", type: "text"},
                signature: { label: "Signature", type: "text"}
            },
            async authorize(credentials, req) {

                const verifyRes = await fetch(`${publicConfig.NEXTAUTH_URL}/api/verify`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: credentials?.message, signature: credentials?.signature }),
                })

                if (verifyRes.ok && credentials) {
                    return { address: credentials.address }
                }

                if (!verifyRes.ok) {} return null;
            }
        })
    ],
    jwt: {
        async encode(params): Promise<string> {
            const namespace = "https://hasura.io/jwt/claims";
            if (params?.token) {
                params.token[namespace] = {
                    'x-hasura-default-role': 'user',
                    'x-hasura-allowed-roles': ['user'],
                    'x-hasura-user-id': params?.token?.address
                };
            }
            return sign(params.token, params.secret, { algorithm: 'HS256'})
        },

        async decode(params): Promise<any | null> {
            return verify(params.token, params.secret);
        },
    },
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return true
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        },
        async jwt({ token, account, user }) {
            const isUserSignedIn = user ? true : false;
            if (isUserSignedIn) {
                token.address = user?.address
            }
            return token;
        },
        async session({ session, token, user }) {
            const encodedToken = sign(token, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256'});
            session.token = encodedToken;
            session.address = token.address;
            return session
        }
    },
})