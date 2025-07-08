import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from '@api/api.ts';
import { getMgrDetail } from '@api/bo/base/mgr/mgrApi.ts';
import type { Chat, Mgr, ChatData } from '@pages/cmm';
import { salmon } from '@utils/salmon.ts';
import { message } from 'antd';
import type {AxiosResponse} from "axios";
import {createQueryKeys} from "@lukemorales/query-key-factory";

const chatKeys = createQueryKeys('chat', {
    all: null,
    list: (mgrId?: Chat['mgrId'], status?: Chat['status'], type?: Chat['type']) =>
        ['list', mgrId, status, type],
    //['chat', 'list', mgrId, status, type]
    detail: (chatSeq: Chat['chatSeq']) => ['detail', chatSeq],
    history: (userId: Chat['userId']) => ['history', userId]
});


export const useChatList = (params?: Chat) => {
    return useQuery({
        queryKey: ['chat', 'chatList', params],
        queryFn: async () => {
            const searchParams = new URLSearchParams();
            const { status, ...rest } = params;

            if (Array.isArray(status)) {
                const result = await Promise.all(
                    status.map(s => {
                        const searchParams = new URLSearchParams();
                        Object.entries({ ...rest, status: s }).forEach(([key, value]) => {
                            if (value === undefined || value === null || value === '' || value === 'all') return;
                            searchParams.append(key, value as string);
                        });
                        return axios.get<Chat[]>(`/chat?${searchParams.toString()}`);
                    })
                );
                return result.flatMap(res => res.data);
            }

            Object.entries(params).forEach(([key, value]) => {
                if (value === undefined || value === null || value === '' || value === 'all') return;
                if (key === 'mgrId') {
                    if (value != '5') searchParams.append(key, value);
                } else {
                    searchParams.append(key, value);
                }
            });
            const response = await axios.get<Chat[]>(`/chat?${searchParams.toString()}`);
            return response.data || [];
        },
        enabled: true,
    });
};


export const useChatDetail = (chatSeq:Chat['chatSeq']) => {
    return useQuery({
        queryKey: ['chat', chatSeq],
        queryFn: async() => {
            const response = await axios.get<Chat[]>(`/chat?chatSeq=${chatSeq}`);
            return response.data[0];
        },
        enabled: !!chatSeq
    });
};
export const useChatDataList = (chatSeq: Chat['chatSeq']) => {
    return useQuery<ChatData[]>({
        queryKey: ['chat','chatData', chatSeq],
        queryFn: async () => {
            const response = await axios.get<ChatData[]>(`/chatData?chatSeq=${chatSeq}`);
            return response.data || [];
        },
        enabled: !!chatSeq,
    });
};

export const useChatCountByStatus = (status: any) => {
    return useQuery({
        queryKey: ['chat','chatCount', status],
        queryFn: async () => {
            if (Array.isArray(status)) {
                const results = await Promise.all(
                    status.map(s => axios.get(`/chat?status=${s}`))
                );
                const total = results.reduce((sum, res) => sum + res.data.length, 0);
                return total;
            } else {
                const res = await axios.get(`/chat?status=${status}`);
                return res.data.length;
            }
        },
        staleTime: 1000 * 10,
    });
};


export const updateChatStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, status }: { chatSeq: Chat['chatSeq']; status: Chat['status'] }) => {
            try {
                const response = await axios.patch<ChatData>(`/chat/${chatSeq}`, { status });
                return response.data;
            } catch (error) {
                message.error('채팅 업데이트 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['chat'] });
            message.success('상담 상태가 변경되었습니다.');
        },
        onError: async () => {
            message.error('상담 상태 변경에 실패했습니다.');
        }
    });
};

export const deleteChatMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (chatSeq: Chat['chatSeq']) => {
            try {
                await axios.delete<Chat>(`/chat/${chatSeq}` );
            } catch (error) {
                console.error('채팅 삭제 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['chat']});
            message.success(`상담이 삭제되었습니다.`);
        },
        onError: async () => {
            message.error('상담 삭제에 실패했습니다.');
        },
    });
};

export const updateChatMgrMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ chatSeq, mgrId }: { chatSeq: Chat['chatSeq']; mgrId: Mgr['mgrId'] }) => {
            try {
                const mgrDetail = await getMgrDetail(mgrId);
                const newDate = salmon.date.newDate().format('YYYY-MM-DD HH:mm:ss');

                // 1. 기존 상담 종료 처리
                await axios.patch<Chat>(`/chat/${chatSeq}`, {
                    transferYn: 'Y',
                    status: '완료',
                    callEndTm: newDate.split(' ')[1],
                });

                // 2. 기존 데이터 조회
                const originalRes: AxiosResponse<Chat> = await axios.get(`/chat/${chatSeq}`);
                const originalChat = originalRes.data;

                // 3. 신규 상담 생성
                const newChatSeq = salmon.date.newDate().format('YYYYMMDD_HHmmss');
                const newChat: Chat = {
                    ...originalChat,
                    id: newChatSeq.toString(),
                    chatSeq: newChatSeq.toString(),
                    mgrId: mgrId,
                    mgrNm: mgrDetail.mgrNm,
                    status: '신규접수',
                    transferYn: 'Y',
                    regDt:newDate,
                    callStartTm: newDate.split(' ')[1],
                    callEndTm: '',
                };
                await axios.post<Chat>('/chat', newChat);

                // 4. 신규 상담 데이터 생성
                const newChatData: ChatData = {
                    id: newChatSeq.toString(),
                    chatSeq: newChatSeq,
                    chatNo: 1,
                    userId: originalChat.userId,
                    userNm: originalChat.userNm,
                    text: '이관되었습니다.',
                    sender:'user',
                    mgrId:mgrId,
                    mgrNm:mgrDetail.mgrNm,
                    sendTime:newDate,
                };
                await axios.post<ChatData>('/chatData', newChatData);
            } catch (error) {
                console.error('상담 이관 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['chat']});
            message.success(`상담 담당자가 변경되었습니다.`);
        },
        onError: async () => {
            message.error('상담 담당자 변경에 실패했습니다.');
        }
    });
};

