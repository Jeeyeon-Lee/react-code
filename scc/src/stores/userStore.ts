import { create } from 'zustand';
import type { User } from '@/types';

interface UserStore {
    userId: User['userId'] | null;
    setUserId: (userId: User['userId']) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userId: 'null',
    setUserId: (userId: User['userId']) => set({userId}),
}));