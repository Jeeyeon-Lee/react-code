// ✅ 채팅/콜 정보
export interface Chat {
    id: number;
    chatSeq: number;
    userId: number;
    mgrId: number;
    userNm: string;
    mgrNm: string;
    title: string;
    status: '미처리' | '처리중' | '처리완료';
    type: '챗' | '콜';
}