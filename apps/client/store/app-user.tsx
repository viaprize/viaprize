import { Api, CreateUser, User } from '@/lib/api';
import { backendApi } from '@/lib/backend';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppUserStore {
  user: User | undefined;
  setUser: (user: User) => void;
  fetchUser: (_userId: string) => Promise<User>;
  refreshUser: (_userId: string) => Promise<void>;
  uploadUser: (newUser: CreateUser) => Promise<void>;
  clearUser: () => void;
}
const useAppUserStore = create(
  persist<AppUserStore>(
    (set, get) => ({
      user: undefined,
      setUser: (user: User) => set({ user }),
      fetchUser: async (_userId: string) => {
        // const res = await myAxios.get(`/users/${_userId}`);
        const res = await new Api().users.usersDetail(_userId);
        return res.data;
      },
      refreshUser: async (_userId: string) => {
        const newUserData = await get().fetchUser(_userId);
        set({ user: newUserData });
      },
      uploadUser: async (newUser: CreateUser) => {
        const res = await (
          await backendApi()
        ).users.usersCreate({
          ...newUser,
        });
        set({ user: res.data });
      },
      clearUser: () => set({ user: undefined }),
    }),
    {
      name: 'app-user-storage',
    },
  ),
);

export default useAppUserStore;
