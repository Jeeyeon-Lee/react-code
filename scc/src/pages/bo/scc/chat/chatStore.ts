import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Chat } from '@pages/cmm';

interface ChatStore {
    chatSeq: Chat['chatSeq'];
    setChatSeq: (chatSeq: Chat['chatSeq']) => void;
    chatType: Chat['type'];
    setChatType: (chatType: Chat['type']) => void;
    clearChatSeq: () => void;
    resetChatStore: () => void;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set) => ({
            chatSeq: '',
            chatType: '',
            setChatSeq: (chatSeq) => set({ chatSeq }),
            setChatType: (chatType) => set({ chatType }),
            clearChatSeq: () => set({ chatSeq: '', chatType: '' }),
            resetChatStore: () =>
                set({ chatSeq: '', chatType: '', chatDetailSeq: '' }),
        }),
        {
            name: 'chat_store',
            // store 내 존재하는 모든 state 를 persist store 에 저장하지 않기 위해 partialize 옵션을 사용하여
            // 필요한 state 만 persist state 로 지정
            partialize: (state) => ({
                chatSeq: state.chatSeq,
                chatType: state.chatType,
            }),

        }
    )
);
