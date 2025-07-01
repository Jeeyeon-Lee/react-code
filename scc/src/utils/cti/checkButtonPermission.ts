import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import { useCtiStore } from '@stores/bo/scc/cti/ctiStore.ts';

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
    | '상담가능';

const buttonPermissionMap: Record<ButtonType, StatusRule> = {
    '상담이관': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['대기중','상담중','보류','후처리','이관'] },
    '보류':    { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중', '후처리'] },
    '보류해제': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['보류'] },
    '상담종료': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중','보류'] },
    '통화':    { mgrStatus: ['상담가능'], chatStatus: ['수신중'] },
    '전화걸기': { mgrStatus: ['상담가능'], chatStatus: 'all' },
    '전화끊기': { mgrStatus: ['상담중'], chatStatus: ['상담중','보류'] },
    '메시지':  { mgrStatus: 'all', chatStatus: 'all' },
    '3자 통화': { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중'] },
    '전송':    { mgrStatus: ['상담가능', '상담중'], chatStatus: ['상담중'] },
    '상담저장': { mgrStatus: ['상담가능', '후처리'], chatStatus: ['후처리', '완료'] },
    '상담수정': { mgrStatus: ['상담가능', '후처리'], chatStatus: ['후처리', '완료'] },
    '완료처리': { mgrStatus: ['상담가능', '상담중', '후처리'], chatStatus: ['상담중','보류','완료','후처리','이관'] },
    '삭제': { mgrStatus: 'all', chatStatus: ['완료', '후처리'], chatStatusNot: ['보류'] },
    '상담가능': { mgrStatus: ['상담가능'], chatStatus: 'all' },
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