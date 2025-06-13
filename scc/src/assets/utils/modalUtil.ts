import { Modal, message } from 'antd';

interface ShowModalProps {
    type: 'confirm' | 'info' | 'warning' | 'error' | 'success' | 'message';
    title: string;
    content?: string;
    onOk?: () => void;
    onCancel?: () => void;
    okText?: string;
    cancelText?: string;
    duration?: number;
}

/** 통합 모달/메시지 호출 함수 */
export const showModal = ({
                            type,
                            title,
                            content,
                            onOk,
                            onCancel,
                            okText = '확인',
                            cancelText = '취소',
                            duration = 2
                        }: ShowModalProps) => {
    switch (type) {
        case 'confirm':
            Modal.confirm({
                title,
                content,
                okText,
                cancelText,
                onOk,
                onCancel,
            });
            break;
        case 'info':
            Modal.info({
                title,
                content,
                onOk,
            });
            break;
        case 'warning':
            Modal.warning({
                title,
                content,
                onOk,
                onCancel,
            });
            break;
        case 'error':
            Modal.error({
                title,
                content,
                onOk,
            });
            break;
        case 'success':
            message.success(content || title, duration);
            break;
        case 'message':
            message.info(content || title, duration);
            break;
        default:
            console.warn('지원되지 않는 모달 타입입니다.');
            break;
    }
};
