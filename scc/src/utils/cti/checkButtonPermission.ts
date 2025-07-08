import { useChatStore } from '@pages/bo/scc/chat/chatStore.ts';
import { useCtiStore } from '@pages/cmm/cti/ctiStore.ts';

type StatusRule = {
    mgrStatus?: 'all' | string[];
    chatStatus?: 'all' | string[];
    chatStatusNot?: string[];
};

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
    | '완료처리'
    | '삭제'
    | '대기';
/*mgrStatus(detailCd-detailNm) : 0-대기, 1-식사, 2-교육, 3-후처리, 4-미팅, 5-휴식, 6-상담불가, 7-작업, 8-티타임, 9-모니터링, 20-OB작업, 99-기타*/
/*chatStatus(detailCd-detailNm) : NEW_CONNECTED-신규접수, CONNECTED-진행중, ACW-후처리, HOLD-보류, TRANSFER-이관, COMPLETE-완료*/
const buttonPermissionMap: Record<ButtonType, StatusRule> = {
    '상담이관': { mgrStatus: ['대기', '작업'], chatStatus: ['신규접수','진행중','보류','후처리','이관', '완료'] },
    '보류':    { mgrStatus: ['대기', '작업'], chatStatus: ['진행중', '후처리'] },
    '보류해제': { mgrStatus: ['대기', '작업'], chatStatus: ['보류'] },
    '상담종료': { mgrStatus: ['대기', '작업'], chatStatus: ['진행중','보류'] },
    '통화':    { mgrStatus: ['대기'], chatStatus: ['진행중'] },
    '전화걸기': { mgrStatus: ['대기'], chatStatus: 'all' },
    '전화끊기': { mgrStatus: ['작업'], chatStatus: ['진행중','보류'] },
    '메시지':  { mgrStatus: 'all', chatStatus: 'all' },
    '3자 통화': { mgrStatus: ['대기', '작업'], chatStatus: ['진행중'] },
    '전송':    { mgrStatus: ['대기', '작업'], chatStatus: ['진행중'] },
    '상담저장': { mgrStatus: ['대기', '후처리'], chatStatus: ['후처리', '완료'] },
    '상담수정': { mgrStatus: ['대기', '후처리'], chatStatus: ['후처리', '완료'] },
    '완료처리': { mgrStatus: ['대기', '작업', '후처리'], chatStatus: ['진행중','보류','완료','후처리','이관'] },
    '삭제': { mgrStatus: 'all', chatStatus: ['완료', '후처리'], chatStatusNot: ['보류'] },
    '대기': { mgrStatus: ['대기'], chatStatus: 'all' },
} as const;

export function checkButtonPermission(button: ButtonType): boolean {
    const { chatSeq } = useChatStore();
    const chatStatus = useCtiStore((state) => state.chatStatusMap[chatSeq]);
    const { mgrStatus } = useCtiStore();
    if(!chatStatus) return;

    const rule = buttonPermissionMap[button];
    if (!rule) return false;

    const isStatusAllowed = (status: string, allowed?: 'all' | string[]) =>
        allowed === 'all' || (Array.isArray(allowed) && allowed.includes(status));

    const isChatBlocked = rule.chatStatusNot?.includes(chatStatus) ?? false;

    return (
        isStatusAllowed(mgrStatus, rule.mgrStatus) &&
        isStatusAllowed(chatStatus, rule.chatStatus) &&
        !isChatBlocked
    );
}