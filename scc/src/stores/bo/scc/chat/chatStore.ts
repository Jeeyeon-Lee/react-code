import { create } from 'zustand';
import type { Chat } from '@/types';


/*zustand를 사용한 전역관리*/
interface ChatStore {
    chatSeq: Chat['chatSeq'];
    setChatSeq: (chatSeq: Chat['chatSeq']) => void;
    clearChatSeq: () => void;
    /*리액트 쿼리로 변경
    updateChatStatus: (chatSeq:Chat['chatSeq'], status:Chat['status']) => Promise<void>;
    updateChatMgr:(chatSeq:Chat['chatSeq'], mgrId:Mgr['mgrId']) => void;
     */
}

export const useChatStore = create<ChatStore>((set) => ({
    chatSeq: '',
    setChatSeq: (seq) => {
        set({ chatSeq: seq })
    },
    clearChatSeq: () => {
        set({ chatSeq: '' })
    },
}));

