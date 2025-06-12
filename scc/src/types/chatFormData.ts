// ✅ 채팅/콜 정보
export interface ChatFormData {
    id: number;
    userId: number;
    counselText: string;
    memoText: string;
    mgrNm: string;
    sender: 'user' | 'mgr';
    timestamp: Date;
    status: '미처리' | '처리중' | '처리완료';
    type: '챗' | '콜';
}