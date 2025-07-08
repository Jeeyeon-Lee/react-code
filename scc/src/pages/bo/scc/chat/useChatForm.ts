import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from '@api/api.ts';
import { getLoginMgr } from '@api/cmm/loginApi.ts';
import type { ChatFormData } from '@pages/cmm';
import { salmon } from '@utils/salmon.ts';
import { message } from 'antd';

export const useChatTextData = (chatSeq: ChatFormData['chatSeq']) => {
    return useQuery<ChatFormData | undefined>({
        queryKey: ['chat', 'chatFormText', chatSeq],
        queryFn: async () => {
            if (!chatSeq) return;
            const response = await axios.get<ChatFormData[]>(`/chatFormData?chatSeq=${chatSeq}`);
            return response.data[0] || [];
        },
        enabled: !!chatSeq,
    });
};

export const useChatMemoData = (chatSeq:ChatFormData['chatSeq']) => {
    return useQuery({
        queryKey: ['chat', 'chatFormMemo', chatSeq],
        queryFn: async () => {
            if (!chatSeq) return;
            const response = await axios.get<ChatFormData[]>(`/chatMemoData?chatSeq=${chatSeq}`);
            return response.data[0] || [];
        },
        enabled: !!chatSeq
    });
}

export const insertChatFormTextMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, text } : { chatSeq: ChatFormData['chatSeq'], text:ChatFormData['text']}) => {
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
            const loginInfo = await getLoginMgr();
            try {
                const newChatFormText: ChatFormData = {
                    id: chatSeq.toString(),
                    chatSeq: chatSeq,
                    mgrId: loginInfo?.mgrId,
                    mgrNm: loginInfo?.mgrNm,
                    text: text,
                    regDt: newDate,
                    modiId: '',
                    modiDt: ''
                };
                await axios.post<ChatFormData>('/chatFormData', newChatFormText);
            } catch (error) {
                console.error('상담 내역 생성 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['chat']});
            message.success(`상담 내역이 등록되었습니다.`);
        },
        onError: async () => {
            message.error('상담 내역 등록에 실패했습니다.');
        },
    });
};

export const insertChatFormMemoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, text } : { chatSeq: ChatFormData['chatSeq'], text:ChatFormData['text']}) => {
            if (!chatSeq || !text) return;
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
            const loginInfo = await getLoginMgr();
            try {
                const newChatFormText: ChatFormData = {
                    id: chatSeq.toString(),
                    chatSeq: chatSeq,
                    mgrId: loginInfo?.mgrId,
                    mgrNm: loginInfo?.mgrNm,
                    text: text,
                    regDt: newDate,
                    modiId: '',
                    modiDt: ''
                };
                await axios.post<ChatFormData>('/chatMemoData', newChatFormText);
            } catch (error) {
                console.error('상담 내역 생성 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['chat'] });
            message.success(`상담 메모가 등록되었습니다.`);
        },
        onError: async () => {
            message.error('상담 메모 등록에 실패했습니다.');
        },
    });
};
export const updateChatFormTextMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, text } : { chatSeq: ChatFormData['chatSeq'], text:ChatFormData['text']}) => {
            if (!chatSeq || !text) return;
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
            const loginInfo = await getLoginMgr();
            try {
                await axios.patch<ChatFormData>(`/chatFormData/${chatSeq}`, {
                    text: text,
                    modiDt:newDate,
                    modiId:loginInfo?.mgrId,
                });
            } catch (error) {
                console.error('상담 내역 수정 실패:', error);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['chat']});
            message.success(`상담 내역이 수정되었습니다.`);
        },
        onError: () => {
            message.error('상담 내역 수정에 실패했습니다.');
        }
    })
};

export const updateChatFormMemoMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, text } : { chatSeq: ChatFormData['chatSeq'], text:ChatFormData['text']}) => {
            if (!chatSeq || !text) return;
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
            const loginInfo = await getLoginMgr();
            try {
                await axios.patch<ChatFormData>(`/chatMemoData/${chatSeq}`, {
                    text: text,
                    modiDt:newDate,
                    modiId:loginInfo?.mgrId,
                });
            } catch (error) {
                console.error('상담 메모 수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['chat']});
            message.success(`상담 메모가 수정되었습니다.`);
        },
        onError: async () => {
            message.error('상담 메모 수정에 실패했습니다.');
        }
    })
};

