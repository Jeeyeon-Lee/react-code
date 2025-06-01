// ✅ 채팅/콜 정보
export interface ChatData {
    id: number;
    userId: number;
    text: string;
    userNm: string;
    mgrNm: string;
    sender: 'user' | 'mgr';
    timestamp: Date;
    status: 'new' | 'process' | 'end';
    type: 'chat' | 'call';
}