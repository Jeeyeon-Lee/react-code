import { create } from 'zustand';
import type { Chat } from '@/types';


/*zustand를 사용한 전역관리*/
interface ChatStore {
    chatSeq: Chat['chatSeq'];
    setChatSeq: (chatSeq: Chat['chatSeq']) => void;
    clearChatSeq: () => void;
    chatType: Chat['type'];
    setChatType: (chatType: Chat['type']) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    chatSeq: '',
    setChatSeq: (seq) => {
        set({ chatSeq: seq });
    },
    clearChatSeq: () => {
        set({ chatSeq: '' });
    },
    chatType: '',
    setChatType: (type) => {
        set({ chatType: type });
    },
}));
