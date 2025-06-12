import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatKeys } from '@query/queryKeys';
import {
    getChatList,
    getChatDetail,
    updateChat,
    updateChatMgr,
    getChatHistory
} from '@api/chatApi';
import type { Chat, Mgr } from '@/types';

export const useChat = () => {
    const queryClient = useQueryClient();

    const useChatList = (mgrId:Chat['mgrId'], status?:Chat['status'], type?:Chat['type']) => {
        return useQuery({
            queryKey: ['chat', mgrId, status, type],
            queryFn: () => getChatList(mgrId, status, type),
            enabled: !!mgrId,
        });
    };

    const useChatDetail = (chatSeq:Chat['chatSeq']) => {
        return useQuery({
            queryKey: chatKeys.detail(chatSeq).queryKey,
            queryFn: () => getChatDetail(chatSeq),
            enabled: !!chatSeq
        });
    };

    const useChatHistory = (userId:Chat['userId']) => {
        return useQuery({
            queryKey: chatKeys.list(userId).queryKey,
            queryFn: () => getChatHistory(userId)
        });
    };

    const updateChatStatusMutation = useMutation({
        mutationFn: ({ chatSeq, status }: { chatSeq: Chat['chatSeq']; status: Chat['status'] }) =>
            updateChat(chatSeq, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        }
    });

    const updateChatMgrMutation = useMutation({
        mutationFn: ({ chatSeq, mgrId }: { chatSeq: Chat['chatSeq']; mgrId:Mgr['mgrId'] }) =>
            updateChatMgr(chatSeq, mgrId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat'], exact: false });
        }
    });

    return {
        useChatList,
        useChatDetail,
        useChatHistory,
        updateChatStatusMutation,
        updateChatMgrMutation
    };
};
