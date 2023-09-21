import myAxios from '@/lib/axios';
import { AppUser, CreateUserDto } from 'types/app-user';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AppUserStore {
  user: AppUser | undefined;
  setUser: (user: AppUser) => void;
  fetchUser: (_userId: string) => Promise<AppUser>;
  refreshUser: (_userId: string) => Promise<void>;
  uploadUser: (newUser: CreateUserDto) => Promise<void>;
  clearUser: () => void;
}
const useAppUserStore = create(
  persist<AppUserStore>(
    (set, get) => ({
      user: undefined,
      setUser: (user: AppUser) => set({ user }),
      fetchUser: async (_userId: string) => {
        const res = await myAxios.get(`/users/${_userId}`);
        return res.data;
      },
      refreshUser: async (_userId: string) => {
        const newUserData = await get().fetchUser(_userId);
        set({ user: newUserData });
      },
      uploadUser: async (newUser: CreateUserDto) => {
        const res = await myAxios.post('/users', newUser);
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
