/*직원상태, 상담상태에 따른 버튼 처리*/
export type ButtonType =
    | '상담이관'
    | '보류'
    | '보류해제'
    | '상담종료'
    | '통화'
    | '전화걸기'
    | '전화끊기'
    | '메시지'
    | '3자 통화'
    | '전송'
    | '상담저장'
    | '상담수정'
    | '상담가능';
/*mgrStatus : await getCodeList(직원상태); 상담준비, 이석-식사, 휴식, 휴가, 상담가능, 후처리, 상담중*/
/*chatStatus : await getCodeList(상담상태); 대기중, 상담중, 완료, 보류, 후처리, 이관*/
const buttonPermissionMap = {
    '상담이관': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['대기중','상담중','보류'] },
    '보류':    { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중'] },
    '보류해제': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['보류'] },
    '상담종료': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중','보류'] },
    '통화':    { mgrStatus: ['상담가능'], chatStatus: ['수신중'] },
    '전화걸기': { mgrStatus: ['상담가능'], chatStatus: ['상담중'] },
    '전화끊기': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중','보류'] },
    '메시지':  { mgrStatus: 'all', chatStatus: 'all' },
    '3자 통화': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중'] },
    '전송':    { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중'] },
    '상담저장': { mgrStatus: ['상담가능', '후처리'], chatStatus: ['후처리', '완료'] },
    '상담수정': { mgrStatus: ['상담가능', '후처리'], chatStatus: ['후처리', '완료'] },
    '상담가능': { mgrStatus: ['상담가능', '후처리'], chatStatus: ['대기중','상담중','보류','완료','후처리','이관'] },
} as const;

export function checkButtonPermission(
    button: ButtonType,
    mgrStatus?: string,
    chatStatus?: string
): boolean {
    const rule = buttonPermissionMap[button];
    if (!rule) return false;

    const { mgrStatus: allowedMgr, chatStatus: allowedChat, chatStatusNot } = rule;

    const isMgrOk =
        allowedMgr === 'all'
            ? true
            : Array.isArray(allowedMgr) && mgrStatus
                ? allowedMgr.includes(mgrStatus)
                : false;

    const isChatOk =
        allowedChat === 'all'
            ? true
            : Array.isArray(allowedChat) && chatStatus
                ? allowedChat.includes(chatStatus)
                : false;

    const isChatBlocked =
        Array.isArray(chatStatusNot) && chatStatus
            ? chatStatusNot.includes(chatStatus)
            : false;

    return isMgrOk && isChatOk && !isChatBlocked;
}

