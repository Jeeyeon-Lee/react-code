import { create } from 'zustand';
import type { User } from '@pages/cmm';
import {persist} from "zustand/middleware";

interface UserStore {
    userId: User['userId'];
    setUserId: (userId: User['userId']) => void;
}

export const useUserStore = create<UserStore>(
    persist(
        (set) => ({
            userId: '',
            setUserId: (userId: User['userId']) => set({userId}),
        }),
        {
            name : 'user_store',
            partialize: (state) => ({
                userId: state.userId,
            }),
        }
    )
);