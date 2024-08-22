import type { CreateUser, UpdateUser } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { getAccessToken, useLogin, usePrivy, useWallets } from '@privy-io/react-auth';
import { usePrivyWagmi } from '@privy-io/wagmi-connector';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAppUserStore from 'store/app-user';

const setLastVisitedPage = (page: string) => {
  localStorage.setItem('lastVisitedPage', page);
};

const getLastVisitedPage = () => {
  return localStorage.getItem('lastVisitedPage') || '/';
};

interface UpdateUserDtoWithUserName extends UpdateUser {
  userName: string;
}

export default function useAppUser() {
  const router = useRouter();
  const pathname = usePathname();
  const appUser = useAppUserStore((state) => state.user);
  const refresh = useAppUserStore((state) => state.refreshUser);
  const uploadUser = useAppUserStore((state) => state.uploadUser);
  const clearUser = useAppUserStore((state) => state.clearUser);
  const loading = useAppUserStore((state) => state.loading);
  const { wallets } = useWallets();

  const { setActiveWallet, wallet } = usePrivyWagmi();

  const { user, logout, ready } = usePrivy();
  console.log({ wallet });
  console.log({ user }, 'userr');

  // const isMounted = useIsMounted()
  // useEffect(() => {
  //   console.log({ appUser, wallet, loading });

  //   if (!loading && appUser && wallet) {
  //     logoutUser();
  //   }
  // }, [appUser, wallet, loading]);

  const { login } = useLogin({
    async onComplete(loginUser, isNewUser, wasAlreadyAuthenticated) {
      const token = await getAccessToken();

      await refreshUser().catch((error) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        console.log({ error }, 'errror');
        if (error?.status) {
          if (error.status === 404) {
            setLastVisitedPage(pathname);
            router.push('/onboarding', {
              query: { redirect: pathname },
            });
          }
        }
      });
      console.log({ token });
      if (wasAlreadyAuthenticated || isNewUser) {
        const walletAddress = loginUser.wallet?.address;
        if (!walletAddress) {
          await logoutUser();
          toast('Wallet address not found, please try again');
          return;
        }
        wallets.forEach((wa) => () => {
          setActiveWallet(wa);
        });
        console.log({ user });
      }

      if (isNewUser && !wasAlreadyAuthenticated) {
        setLastVisitedPage(pathname);
        router.push('/onboarding', {
          query: { redirect: pathname },
        });
        toast('Welcome to Viaprize! Please complete your profile to continue');
      }
    },
    async onError(error) {
      await logoutUser();
      toast.error(`Error: ${error} While Logging In `);
    },
  });

  const createNewUser = async (
    userWithoutUserId: Omit<CreateUser, 'authId'>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix any
  ): Promise<any> => {
    if (!user) {
      throw new Error('User is not logged in');
    }
    return uploadUser({
      ...userWithoutUserId,
      authId: user.id,
    });
  };

  // eslint-disable-next-line @typescript-eslint/require-await -- its being waited in the hook
  const loginUser = async (): Promise<void> => {
    if (!user && appUser) {
      await logoutUser();
    }
    login();
  };

  const logoutUser = async (): Promise<void> => {
    await logout().finally(() => {
      wallet?.disconnect();
      clearUser();
    });
    const path = localStorage.getItem('lastVisitedPage') as string;
    router.push(path);

    // router.push('/');
  };

  const updateUser = async (updateUserDTO: UpdateUserDtoWithUserName) => {
    console.log(updateUser, 'updateUser');
    const { userName, ...propertiesToUpdate } = updateUserDTO;
    const thisUser = await (
      await backendApi()
    ).users.updateCreate(updateUserDTO.userName, propertiesToUpdate);
    await refreshUser();
    return thisUser.data;
  };

  const getUserByUserName = async (userName: string) => {
    const thisUser = await (await backendApi()).users.usernameDetail(userName);
    return thisUser.data;
  };

  const refreshUser = async (): Promise<void> => {
    if (user) {
      await refresh(user.id);
    }
  };

  const isOwner = user?.id === appUser?.authId;

  return {
    refreshUser,
    createNewUser,
    logoutUser,
    appUser,
    loginUser,
    updateUser,
    getUserByUserName,
    loading,
    setLastVisitedPage,
    getLastVisitedPage,
  };
}
