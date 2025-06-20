import { create } from 'zustand';
import type { Mgr } from '@/types';

interface MgrStore {
    mgrId: Mgr['mgrID'];
    setMgrId: (mgrId: Mgr['mgrId']) => void;
    mgrStatus: Mgr['mgrStatus'];
    setMgrStatus: (mgrStatus: Mgr['mgrStatus']) => void;
}

export const useUserStore = create<MgrStore>((set) => ({
    mgrId: '',
    setMgrId: (mgrId: Mgr['mgrId']) => set({mgrId}),
    mgrStatus: '',
    setMgrStatus: (mgrStatus: Mgr['mgrStatus']) => set({mgrStatus}),
}));