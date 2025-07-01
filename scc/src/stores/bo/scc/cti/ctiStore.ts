// stores/ctiStore.ts
import { create } from 'zustand';

interface CtiStore {Ø
    socketStatus: 'connected' | 'disconnected';
    mgrStatus: string;
    chatStatusMap: Record<string, string>;
    setSocketStatus: (status: 'connected' | 'disconnected') => void;
    setMgrStatus: (status: string) => void;
    setChatStatus: (chatSeq: string, status: string) => void;
    clearStatuses: () => void;
}

export const useCtiStore = create<CtiStore>((set) => ({
    socketStatus: 'open',
    mgrStatus: '',
    chatStatusMap: {},
    setSocketStatus: (status) => set({ socketStatus: status }),
    setMgrStatus: (status) => set({ mgrStatus: status }),
    setChatStatus: (chatSeq, status) =>
        set((state) => ({
            chatStatusMap: { ...state.chatStatusMap, [chatSeq]: status }
        })),
    clearStatuses: () => set({ mgrStatus: '', chatStatusMap: {} }),
}));
