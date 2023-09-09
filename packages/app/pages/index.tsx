import { useLogin, useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useRouter } from 'next/router';

export default function MyComponent() {
    // const { login, ready, authenticated, } = usePrivy();
    const { wallets } = useWallets();
    const router = useRouter();
    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();

    const { login } = useLogin({
        onComplete(user, isNewUser, wasAlreadyAuthenticated) {
            // Handle login completion
            if (isNewUser) {
                router.push('/onboarding');
            }

            router.push('/prize/explorePrize');

        },
    })

    return (
        <div>
            <button onClick={() => login()}>login</button>;
        </div>
    );
}