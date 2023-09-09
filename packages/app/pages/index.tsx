import myAxios from '@/lib/axios';
import { getAccessToken, useLogin, useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function MyComponent() {
    // const { login, ready, authenticated, } = usePrivy();
    const { wallets } = useWallets();
    const router = useRouter();
    const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();


    const { login } = useLogin({
        async onComplete(user, isNewUser, wasAlreadyAuthenticated) {
            console.log(user.wallet, "wallets ")
            const authToken = await getAccessToken();

            myAxios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
            const walletAddress = user.wallet?.address
            if (!walletAddress) {

                toast(<h1>Wallet address is not given</h1>)
                return
            }
            setActiveWallet(wallets[0])

            // Handle login completion
            if (isNewUser) {

                router.push('/onboarding');
            }
            else {
                router.push('/prize/explorePrize')
            }


        },
    })

    return (
        <div>
            <button onClick={() => login()}>login</button>;
        </div>
    );
}