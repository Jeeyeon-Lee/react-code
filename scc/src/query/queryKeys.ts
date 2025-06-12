import { createQueryKeys } from '@lukemorales/query-key-factory';
import type { Chat, User, Mgr } from '@/types';

export const userKeys = createQueryKeys('user', {
    all: { queryKey: ['user'] },
    list: null,
    detail: (userId:User['userId']) => [userId],
});

export const chatKeys = createQueryKeys('chat', {
    all: { queryKey: ['chat'] },
    list: (mgrId: Mgr['mgrId']) => [mgrId],
    detail: (chatSeq: Chat['chatSeq']) => [chatSeq],
});

export const loginKeys = createQueryKeys('login', {
    all: { queryKey: ['login'] },
    byId: (id: number) => ({ queryKey: ['login', id] }),
});
