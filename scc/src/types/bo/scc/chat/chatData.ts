// ✅ 채팅/콜 정보
export interface ChatData {
    id: string;
    chatSeq: string;
    chatNo: number;
    userId: string;
    userNm: string;
    mgrId: string;
    mgrNm: string;
    text: string;
    sender: 'user' | 'mgr';
    sendTime: string;
}