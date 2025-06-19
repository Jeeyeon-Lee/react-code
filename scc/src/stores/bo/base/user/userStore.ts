import { create } from 'zustand';
import type { User } from '@/types';

interface UserStore {
    userId: User['userId'];
    setUserId: (userId: User['userId']) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    userId: '',
    setUserId: (userId: User['userId']) => set({userId}),
}));