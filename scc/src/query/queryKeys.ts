import { createQueryKeys } from '@lukemorales/query-key-factory';
import type { Chat, User, Mgr } from '@/types';

export const userKeys = createQueryKeys('user', {
    all: null,
    list: () => ['list'],
    detail: (userId:User['userId']) => ['detail', userId],
});

export const chatKeys = createQueryKeys('chat', {
    all: null, //null이지만 'chat'으로 들어가짐
    list: (mgrId?: Chat['mgrId'], status?: Chat['status'], type?: Chat['type']) =>
        ['list', mgrId, status, type],
    //['chat', 'list', mgrId, status, type]
    detail: (chatSeq: Chat['chatSeq']) => ['detail', chatSeq],
    history: (userId: Chat['userId']) => ['history', userId]
});

export const loginKeys = createQueryKeys('login', {
    all: null,
    byId: (id: number) => ['byId', id],
});

export const mgrKeys = createQueryKeys('mgr', {
    all: null,
    list: () => ['list'],
    detail: (mgrId:Mgr['mgrId']) => ['datail', mgrId],
});

