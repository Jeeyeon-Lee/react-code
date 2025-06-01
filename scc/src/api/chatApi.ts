import Api from './api';
import type {Chat, ChatData} from '@/types';

export const getChatList = async () => {
    const response = await Api.get<Chat[]>('/chat');
    return response;
};

export const getChatDetail = async (chatSeq: number) => {
    const response = await Api.get<ChatData[]>(`/chatData?chatSeq=${chatSeq}`);
    return response.data;
};

export const sendMessage = async (message: {
    chatSeq: number;
    text: string;
    sender: 'user' | 'mgr';
    userId: number;
    userNm: string;
    mgrNm: string;
}) => {
    const response = await Api.post('/chatData', {
        ...message,
        id: Date.now(),
        chatNo: 0,
        timestamp: new Date().toISOString()
    });
    return response.data;
};

