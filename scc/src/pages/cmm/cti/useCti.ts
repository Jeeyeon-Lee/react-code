import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from '@api/api.ts';
import { useCtiStore } from '@pages/cmm/cti/ctiStore.ts';
import {updateLoginStatus, updateMgrLoginStatus} from '@api/cmm/loginApi.ts';
import { message } from 'antd';
import type {Login, Mgr} from "@pages/cmm";
import {mgrKeys} from "@pages/bo/base/mgr/useMgr";

// 사용자 상태변경
export const useUpdateMgrStatusMutation = () => {
    const { setMgrStatus } = useCtiStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ loginInfo, status }: { loginInfo: Login; status: Login['status'] }) =>
            updateLoginStatus(loginInfo, status),
        onSuccess: (_, { status }) => {
            setMgrStatus(status);
            queryClient.invalidateQueries({ queryKey: ['login'] });
            message.success(`계정 상태를 변경하였습니다.`);
        },
    });
};

// 사용자 상태변경
export const useUpdateMgrLoginStatusMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mgrId, login }: { mgrId: Mgr['mgrId']; login: Mgr['login'] }) =>
            updateMgrLoginStatus(mgrId, login),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['login'], exact: false });
            queryClient.invalidateQueries({ queryKey: mgrKeys.list().queryKey });
            message.success(`계정 상태를 변경하였습니다.`);
        },
    });
};

// 전화 관련 버튼 처리 함수들
export const callStart = async (mgrId: string, chatSeq: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'CALL_START',
        mgrId,
        chatSeq,
    });

    const { setMgrStatus, setChatStatus } = useCtiStore.getState?.();
    setMgrStatus('작업');
    setChatStatus(chatSeq, '진행중');
};

export const obCallStart = async (mgrId: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'OB_CALL_START',
        mgrId,
    });

    /*const { setMgrStatus, setChatStatus } = useCtiStore.getState?.();
    setMgrStatus('작업');*/
};

export const callbackStart = async (mgrId: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'CALLBACK_START',
        mgrId,
    });

    /*const { setMgrStatus, setChatStatus } = useCtiStore.getState?.();
    setMgrStatus('작업');*/
};

export const callEnd = async (mgrId: string, chatSeq: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'CALL_END',
        mgrId,
        chatSeq,
    });

    const { setMgrStatus, setChatStatus } = useCtiStore.getState?.();
    setMgrStatus('후처리');
    setChatStatus(chatSeq, '후처리');
};

export const transferCall = async (mgrId: string, chatSeq: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;
    await ctiEvent({
        type: 'CALL_TRANSFER',
        mgrId,
        chatSeq,
    });

    const { setChatStatus } = useCtiStore.getState?.();
    setChatStatus(chatSeq, '이관');
};

export const holdCall = async (chatSeq: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;
    await ctiEvent({
        type: 'CALL_HOLD',
        chatSeq,
    });

    const { setChatStatus } = useCtiStore.getState?.();
    setChatStatus(chatSeq, '보류');
};

export const resumeCall = async (chatSeq: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;
    await ctiEvent({
        type: 'CALL_RESUME',
        chatSeq,
    });

    const { setChatStatus } = useCtiStore.getState?.();
    setChatStatus(chatSeq, '진행중');
};

export const changeChatStatus = async (chatSeq: string, status: string) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'CALL_STATUS_CHANGE',
        chatSeq,
        title: `채팅 상태를 '${status}'로 변경할까요?`
    });

    const { setChatStatus } = useCtiStore.getState?.();
    setChatStatus(chatSeq, status);
};

export const deleteChatSession = async (chatSeq: string, afterDelete: () => void) => {
    const ok = await checkSocketConnected();
    if (!ok) return;

    await ctiEvent({
        type: 'CALL_END_MANUAL',
        chatSeq,
        title: '상담을 삭제하시겠습니까?'
    });

    afterDelete();
};

export const useSocketDetail = () => {
    return useQuery({
        queryKey: ['socket'],
        queryFn: async () => {
            const res = await axios.get('/socket');
            return res.data[0];
        },
    });
};

export const updateSocketStatusMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (status: string) => {
            try {
                const res = await axios.patch(`/socket/1`, { status });
                return res.data;
            } catch (error) {
                message.error('소켓 상태 업데이트 실패');
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['socket'] });
            message.success('소켓 상태가 변경되었습니다.');
        },
    });
};

const checkSocketConnected = async (): Promise<boolean> => {
    try {
        const res = await axios.get('/socket');
        const socket = res.data[0];
        if (socket.status !== 'open') {
            message.error('소켓이 연결된 상태가 아닙니다.');
            return false;
        }
        return true;
    } catch (e) {
        message.error('소켓 상태 확인 중 오류가 발생했습니다.');
        return false;
    }
};

interface SimulateEventProps {
    type: string;
    chatSeq?: string;
    mgrId?: string;
    onOk: () => void;
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
}

export const ctiEvent = ({
                            type,
                            chatSeq,
                            mgrId,
                            title,
                            content,
                            okText = '확인',
                            cancelText = '취소',
                        }: Omit<SimulateEventProps, 'onOk'>): Promise<void> => {
    return new Promise((resolve) => {
        resolve();
        /*modal({
            type: 'confirm',
            title: title || `CTI 이벤트: ${type}`,
            content: content || `'${type}' 이벤트를 처리하시겠습니까?`,
            okText,
            cancelText,
            onOk: () => {
                console.log(`[CTI_SIMULATE] type: ${type}, chatSeq: ${chatSeq}, mgrId: ${mgrId}`);
                resolve(); // <- 여기서 resolve
            },
        });*/

        // 여기에 socket.send 나중에 붙이면 됨
        // socket.send(JSON.stringify({ type, chatSeq, mgrId }));
    });
};


/*
실제 CTI 서버 붙었을 때 예시 (WebSocket 기반 가정):

export const callStart = (mgrId: string, chatSeq: string) => {
    socket.send(JSON.stringify({ type: 'CALL_START', mgrId, chatSeq }));
};

// 그리고 WebSocket 수신부에서 상태 업데이트:
socket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    const { setMgrStatus, setChatStatus } = useCtiStore.getState();

    switch (data.type) {
        case 'CALL_CONNECTED':
            setMgrStatus('작업');
            setChatStatus(data.chatSeq, '진행중');
            break;
        case 'CALL_ENDED':
            setMgrStatus('후처리');
            setChatStatus(data.chatSeq, '후처리');
            break;
        case 'CALL_TRANSFERRED':
            setChatStatus(data.chatSeq, '이관');
            break;
        // ...기타 이벤트
    }
};
*/