import myAxios from '@/lib/axios';
import { Button } from '@mantine/core';
import { getAccessToken, useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function MyComponent() {
  // const { login, ready, authenticated, } = usePrivy();
  const { wallets } = useWallets();
  const router = useRouter();
  const { wallet: activeWallet, setActiveWallet } = usePrivyWagmi();
  const { user } = usePrivy();

  const { login } = useLogin({
    async onComplete(user, isNewUser, wasAlreadyAuthenticated) {
      console.log(user.wallet, 'wallets ');
      const authToken = await getAccessToken();

      myAxios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      const walletAddress = user.wallet?.address;
      if (!walletAddress) {
        toast(<h1>Wallet address is not given</h1>);
        return;
      }
      wallets.forEach((wallet) => {
        setActiveWallet(wallet);
      });

      // Handle login completion
      if (isNewUser) {
        router.push('/onboarding');
      } else {
        router.push('/prize/explore-prizes');
      }
    },
  });

  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className=" max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex">
          <p
            className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl
            lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 "
          >
            Welcome To ViaPrize&nbsp;
          </p>
        </div>

        <div className="relative flex place-items-center">
          <Image
            // className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/viaprize.png"
            alt="ViaPrize Logo"
            width={180}
            height={147}
            priority
          />
          {user ? (
            <div>
              <p className="text-2xl font-semibold">Welcome Back</p>
              <p className="text-xl font-semibold">
                Your Wallet Address is {user?.wallet?.address}
              </p>
              <Button className='z-50' color="dark" onClick={() => router.push('/prize/explorePrize')}>
                Explore Prizes
              </Button>
            </div>
          ) : (
            <Button color="dark" onClick={() => login()}>
              login
            </Button>
          )}
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              About Prizes{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Find in-depth information about Prizes and how they work.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Explore Prizes{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Explore and discover open Prizes proposed by our community.
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Pacts{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Find in-depth information about Pacts and how they work.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Explore Pacts{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Explore and discover open Pacts proposed by our community.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
