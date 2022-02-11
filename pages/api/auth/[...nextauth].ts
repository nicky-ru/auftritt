import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
// @ts-ignore
import { sign, verify } from 'jsonwebtoken'

export default NextAuth({
    providers: [
        CredentialsProvider({
            id: 'metamask',
            name: 'Metamask',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                email: {  label: "Email", type: "email", placeholder: "jsmith@mail.com" }
            },
            async authorize(credentials, req) {
                return { id: 1, name: credentials?.username, email: credentials?.email }

                // const res = await fetch("/your/endpoint", {
                //     method: 'POST',
                //     body: JSON.stringify(credentials),
                //     headers: { "Content-Type": "application/json" }
                // })
                // const user = await res.json()
                //
                // if (res.ok && user) {
                //     return user
                // }
                // return null
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
                    'x-hasura-user-id': params?.token?.email
                };
            }
            return sign(params.token, params.secret)
        },

        async decode(params): Promise<any | null> {
            return verify(params.token, params.secret);
        },
    },
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            const isAllowedToSignIn = true
            // console.log("user", user)
            // console.log("account", account)
            // console.log("profile", profile)
            // console.log('email', email)
            // console.log('credentials', credentials)
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
            // console.log(isUserSignedIn)
            // console.log('jwt user', user)
            // console.log('jwt token', token)
            // token['x-hasura-default-role'] = 'user'
            // token['x-hasura-allowed-roles'] = ['user']
            // token['x-hasura-user-id'] = token.email
            return token;
        },
        async session({ session, token, user }) {
            const encodedToken = sign(token, process.env.NEXTAUTH_SECRET, { algorithm: 'HS256'});
            session.id = token.id;
            session.token = encodedToken;

            // console.log('session', session)
            // console.log('token', token)
            // console.log('user', user)

            return session
        }
    },
})