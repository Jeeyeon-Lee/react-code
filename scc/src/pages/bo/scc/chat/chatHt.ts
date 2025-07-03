export interface chatHt {
    id: string;
    chatSeq: string;
    userId: string;
    mgrId: string;
    userNm: string;
    mgrNm: string;
    title: string;
    status: string;
    type: '챗' | '콜' | 'all' | '';
    transferYn: 'Y' | 'N' | '';
    hold_cnt: number;
    callStartTm: string;
    callHoldTm: string;
    callEndTm: string;
    totalCallTm: string;
    totalOperTm: string;
    regDt: string;
    modiDt: string;
}
