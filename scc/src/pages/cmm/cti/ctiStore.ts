// stores/ctiStore.ts
import { create } from 'zustand';
import {persist} from "zustand/middleware";

interface CtiStore {
    socketStatus: 'connected' | 'disconnected';
    mgrStatus: string;
    chatStatusMap: Record<string, string>;
    setSocketStatus: (status: 'connected' | 'disconnected') => void;
    setMgrStatus: (status: string) => void;
    setChatStatus: (chatSeq: string, status: string) => void;
    clearStatuses: () => void;
}

export const useCtiStore = create<CtiStore>(
    persist(
        (set) => ({
            socketStatus: 'open',
            mgrStatus: '',
            chatStatusMap: {},
            setSocketStatus: (status) => set({socketStatus: status}),
            setMgrStatus: (status) => set({mgrStatus: status}),
            setChatStatus: (chatSeq, status) =>
                set((state) => ({
                    chatStatusMap: {...state.chatStatusMap, [chatSeq]: status}
                })),
            clearStatuses: () => set({mgrStatus: '', chatStatusMap: {}}),
        }),
        {
            name: 'cti_store',
            partialize: (state) => ({
                socketStatus: state.socketStatus,
                mgrStatus: state.mgrStatus,
                chatStatusMap: state.chatStatusMap,
            }),
        }
    )
);
