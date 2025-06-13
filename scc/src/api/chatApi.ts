import Api from './api';
import type {Chat, ChatData, Mgr} from '@/types';
import { getMgrDetail } from '@api/mgrApi';
import dayjs from 'dayjs';

//상담 리스트 조회
export const getChatList = async (mgrId:Chat['mgrId'], status?:Chat['status'], type?:Chat['type']) => {
    const params = new URLSearchParams();
    //나중엔 권한으로 처리하는 것 필요.
    if (mgrId != '5') params.append('mgrId', mgrId);
    if (status && status !== 'all') params.append('status', status);
    if (type && type !== 'all') params.append('type', type);
    const response = await Api.get<Chat[]>(`/chat?${params.toString()}`);
    return response.data;
/*
    const response = await Api.get<Chat[]>(`/chat?mgrId=${mgrId}`);
    return response.data;*/
};

//상담 내역 조회 by userId
export const getChatHistory = async (userId: Chat['userId']) => {
    if (!userId) return;
    const response = await Api.get<Chat[]>(`/chat?userId=${userId}`);
    return response.data;
};

//상담 상세 조회
export const getChatDetail = async (chatSeq: Chat['chatSeq']) => {
    const response = await Api.get<Chat[]>(`/chat?chatSeq=${chatSeq}`);
    return response.data;
};

//상담 데이터 조회
export const getChatDataList = async (chatSeq: ChatData['chatSeq']) => {
    const response = await Api.get<ChatData[]>(`/chatData?chatSeq=${chatSeq}`);
    return response.data;
};



//상담 업데이트
export const updateChat = async (chatSeq: Chat['chatSeq'], status: Chat['status']) => {
    try {
        const response = await Api.patch<ChatData>(`/chat/${chatSeq}`, {status} );
        return response.data;
    } catch (error) {
        console.error('채팅 업데이트 실패:', error);
        throw error;
    }
};

//상담 팀원 변경(담당자 변경)
//현재 chatSeq는 update(이관Y, 종료)
//새로운 chat insert (이관Y, 미처리, mgrId)
export const updateChatMgr = async (chatSeq: Chat['chatSeq'], mgrId: Mgr['mgrId']) => {
    if (!chatSeq || !mgrId) return;

    try {
        const mgrDetail = await getMgrDetail(mgrId);
        const newDate = dayjs(new Date()).format('YYYY/MM/DD HH:mm:ss');

        // 1. 기존 상담 종료 처리
        await Api.patch<Chat>(`/chat/${chatSeq}`, {
            transferYn: 'Y',
            status: '처리완료',
            ed: newDate,
        });

        // 2. 기존 데이터 조회
        const originalRes = await Api.get<Chat>(`/chat/${chatSeq}`);
        const originalChat = originalRes.data;

        // 3. 신규 상담 생성
        const newChatSeq = dayjs(new Date()).format('YYYYMMDD_HHmmss');

        const newChat: Chat = {
            ...originalChat,
            id: newChatSeq.toString(),
            chatSeq: newChatSeq,
            mgrId: mgrId,
            mgrNm: mgrDetail.mgrNm,
            status: '미처리',
            transferYn: 'Y',
            sd: newDate,
            ed: '',
        };

        await Api.post<Chat>('/chat', newChat);

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
        await Api.post<ChatData>('/chatData', newChatData);

    } catch (error) {
        console.error('상담 이관 실패:', error);
        throw error;
    }
};

