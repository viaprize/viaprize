'use client'

import { usePrivy } from '@privy-io/react-auth'
import { IconWallet } from '@tabler/icons-react'
import { Button } from '@viaprize/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@viaprize/ui/card'

export default function RecoveryPage() {
    const { ready, authenticated, user, exportWallet, login } = usePrivy()

    // Check if user is authenticated
    const isAuthenticated = ready && authenticated

    // Check if user has an embedded wallet
    const hasEmbeddedWallet = user?.linkedAccounts?.find(
        (account) =>
            account.type === 'wallet'

    )

    return (
        <div className="container max-w-2xl mx-auto py-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Wallet Recovery</CardTitle>
                    <CardDescription>
                        {isAuthenticated
                            ? "Export your wallet's private key or seed phrase to use it with other wallet applications like MetaMask."
                            : "Please login to access your wallet recovery options."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    {isAuthenticated ? (
                        <>
                            <Button
                                onClick={exportWallet}
                                disabled={!hasEmbeddedWallet}
                                size="lg"
                                className="flex items-center gap-2"
                            >
                                <IconWallet className="h-5 w-5" />
                                Export Wallet
                            </Button>

                            {!hasEmbeddedWallet && (
                                <p className="text-red-500 text-sm">
                                    No embedded wallet found to export
                                </p>
                            )}
                        </>
                    ) : (
                        <Button
                            onClick={login}
                            size="lg"
                            className="flex items-center gap-2"
                        >
                            <IconWallet className="h-5 w-5" />
                            Login with Privy
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 