import { Modal, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import type { ModalFuncProps } from 'antd';

const gridSearch = (gridInstance: any, params: any) => {
    gridInstance?.search?.(params);
};

const modalClose = () => {
    // Zustand로 모달 상태 false 처리 예정
};

const i18n = (code: string): string => {
    const messages: Record<string, string> = {
        '전화걸기': 'Make Call',
        '최근_통화': 'Recent Call',
        '직접_입력': 'Manual Input'
    };
    return messages[code] || code;
};

interface ShowModalProps extends ModalFuncProps {
    type: "error" | "confirm" | "info" | "warning" | "success" | "warn" | undefined;
    duration?: number;
}

export const modal = (props: ShowModalProps) => {
    const {
        type,
        title,
        content,
        onOk,
        onCancel,
        okText = '확인',
        cancelText = '취소',
        duration = 2,
        ...rest
    } = props;

    switch (type) {
        case 'confirm':
            Modal.confirm({ title, content, okText, cancelText, onOk, onCancel, ...rest });
            break;
        case 'info':
            Modal.info({ title, content, onOk, ...rest });
            break;
        case 'warning':
            Modal.warning({ title, content, onOk, onCancel, ...rest });
            break;
        case 'error':
            Modal.error({ title, content, onOk, ...rest });
            break;
        case 'success':
            message.success(content || title, duration);
            break;
        case 'warn':
            message.warning(content || title, duration);
            break;
        default:
            console.warn('지원되지 않는 모달 타입입니다.');
            break;
    }
};

export const date = {
    newDate: (value?: string | Date) => value ? dayjs(value) : dayjs(),

    //salmon.date.format('20240617', 'YYYYMMDD_HHmmss');
    format: (value: string | Date | Dayjs, format: string = 'YYYY-MM-DD') =>
        dayjs(value).format(format),

    set: (value: string | Date | Dayjs, obj: Partial<Record<'year' | 'month' | 'date' | 'hour' | 'minute' | 'second', number>>) =>
        Object.entries(obj).reduce((acc, [key, val]) => {
            return acc.set(key as any, val!);
        }, dayjs(value)),

    add: (value: string | Date | Dayjs, amount: number, unit: dayjs.ManipulateType) =>
        dayjs(value).add(amount, unit),

    isBefore: (a: string | Date | Dayjs, b: string | Date | Dayjs) =>
        dayjs(a).isBefore(dayjs(b))
}
export const salmon = {
    gridSearch,
    modalClose,
    i18n,
    modal,
    date
};
