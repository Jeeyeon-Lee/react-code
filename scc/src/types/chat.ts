// ✅ 채팅/콜 정보
export interface Chat {
    id: string;
    chatSeq: string;
    userId: string;
    mgrId: string;
    userNm: string;
    mgrNm: string;
    title: string;
    status: '미처리' | '처리중' | '처리완료' | '보류' | 'all' | '';
    type: '챗' | '콜' | 'all' | '';
    qusetion: string;
    transferYn: 'Y' | 'N' | '';
    sd: string;
    ed: string;
}