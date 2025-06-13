import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
            staleTime: 3000, // 데이터 신선도 유지 시간
            refetchInterval: 6000, // 실시간 주기적 업데이트 원함
            refetchIntervalInBackground: true, //페이지가 포커스 되면 새로고침
        });
    };

    const useChatDetail = (chatSeq:Chat['chatSeq']) => {
        return useQuery({
            // queryKey: chatKeys.detail(chatSeq).queryKey,
            queryKey: ['chat', chatSeq],
            queryFn: () => getChatDetail(chatSeq),
            enabled: !!chatSeq
        });
    };

    const useChatHistory = (userId:Chat['userId']) => {
        return useQuery({
            // queryKey: chatKeys.list(userId).queryKey,
            queryKey: ['chat', userId],
            queryFn: () => getChatHistory(userId),
            enabled: !!userId
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
