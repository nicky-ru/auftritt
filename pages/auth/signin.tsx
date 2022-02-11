import { getProviders, signIn } from "next-auth/react"

export default function SignIn() {
    return (
        <>
            <div>
                <button onClick={() => signIn('metamask')}>
                    Sign in with Metamask
                </button>
            </div>
        </>
    )
}