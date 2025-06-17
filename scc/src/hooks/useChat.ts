import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getChatList,
    getChatDetail,
    updateChat,
    updateChatMgr,
    getChatHistory,
    getChatDataList,
    deleteChat,
    insertChatFormText,
    insertChatFormMemo,
    getChatFormText,
    getChatFormMemo
} from '@api/chatApi';
import type { Chat, Mgr, ChatFormData } from '@/types';
import {chatKeys} from '@query/queryKeys';
import { message } from 'antd';
import { useChatStore } from '@stores/chatStore';
import { useUserStore } from '@stores/userStore';


export const useChat = () => {
    const queryClient = useQueryClient();
    const { clearChatSeq } = useChatStore();
    const { setUserId } = useUserStore();

    const useChatList = (mgrId:Chat['mgrId'], status?:Chat['status'], type?:Chat['type']) => {
        //파라미터 방식 : 객체로 보내고 처리 [Chat]
        return useQuery({
            // queryKey: ['chat', mgrId, status, type], 키팩토리 사용 안할때,
            queryKey: chatKeys.list(mgrId, status, type).queryKey,
            queryFn: () => getChatList(mgrId, status, type),
            enabled: !!mgrId,
            /*staleTime: 3000, // 데이터 신선도 유지 시간
            refetchInterval: 6000, // 실시간 주기적 업데이트 원함
            refetchIntervalInBackground: true, //페이지가 포커스 되면 새로고침*/
        });
    };

    const useChatDetail = (chatSeq:Chat['chatSeq']) => {
        return useQuery({
            queryKey: chatKeys.detail(chatSeq).queryKey,
            queryFn: () => getChatDetail(chatSeq),
            enabled: !!chatSeq
        });
    };

    const useChatDataList = (chatSeq:Chat['chatSeq']) => {
        return useQuery({
            queryKey: chatKeys.detail(chatSeq).queryKey,
            queryFn: () => getChatDataList(chatSeq),
            enabled: !!chatSeq
        });
    };

    const useChatHistory = (userId:Chat['userId']) => {
        return useQuery({
            // queryKey: ['chat', userId],
            queryKey: chatKeys.history(userId).queryKey,
            queryFn: () => getChatHistory(userId),
            enabled: !!userId
        });
    };


    const useChatTextData = (chatSeq:Chat['chatSeq']) => {
        return useQuery({
            queryKey: ['chatFormText', chatSeq],
            queryFn: () => getChatFormText(chatSeq),
            enabled: !!chatSeq
        });
    }

    const useChatMemoData = (chatSeq:Chat['chatSeq']) => {
        useQuery({
            queryKey: ['chatFormMemo', chatSeq],
            queryFn: () => getChatFormMemo(chatSeq),
            enabled: !!chatSeq
        });
    }

    const updateChatStatusMutation = useMutation({
        mutationFn: ({ chatSeq, status }: { chatSeq: Chat['chatSeq']; status: Chat['status'] }) =>
            updateChat(chatSeq, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담 상태가 변경되었습니다.`);
        },
        onError: () => {
            message.error('상담 상태 변경에 실패했습니다.');
        }
    });

    const deleteChatMutation = useMutation({
        mutationFn: ({ chatSeq }: { chatSeq: Chat['chatSeq']; }) =>
            deleteChat(chatSeq),
        onSuccess: () => {
            clearChatSeq();
            setUserId('');
            queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담이 삭제되었습니다.`);
        },
        onError: () => {
            message.error('상담 삭제에 실패했습니다.');
        }
    });

    const updateChatMgrMutation = useMutation({
        mutationFn: ({ chatSeq, mgrId }: { chatSeq: Chat['chatSeq']; mgrId:Mgr['mgrId'] }) =>
            updateChatMgr(chatSeq, mgrId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담 담당자가 변경되었습니다.`);
        },
        onError: () => {
            message.error('상담 담당자 변경에 실패했습니다.');
        }
    });

    const insertChatFormTextMutation = useMutation({
        mutationFn: ({chatSeq, text } :{ chatSeq: ChatFormData['chatSeq']; text:ChatFormData['text'] }) =>
            insertChatFormText(chatSeq, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담 내역이 등록되었습니다.`);
        },
        onError: () => {
            message.error('상담 내역 등록에 실패했습니다.');
        }
    });

    const insertChatFormMemoMutation = useMutation({
        mutationFn: ({chatSeq, text } :{ chatSeq: ChatFormData['chatSeq']; text:ChatFormData['text'] }) =>
            insertChatFormMemo(chatSeq, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담 메모가 등록되었습니다.`);
        },
        onError: () => {
            message.error('상담 메모 등록에 실패했습니다.');
        }
    });


    return {
        useChatList,
        useChatDetail,
        useChatDataList,
        useChatHistory,
        useChatTextData,
        useChatMemoData,
        deleteChatMutation,
        updateChatStatusMutation,
        updateChatMgrMutation,
        insertChatFormTextMutation,
        insertChatFormMemoMutation
    };
};
