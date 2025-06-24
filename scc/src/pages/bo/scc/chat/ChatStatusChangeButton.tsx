import React from 'react';
import ChatMgrChangeButton from "@pages/bo/scc/chat/ChatMgrChangeButton.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteTwoTone, PhoneTwoTone, StopTwoTone} from "@ant-design/icons";
import {message, Space} from "antd";
import {updateChatStatusMutation, useChatDetail} from "@hooks/bo/scc/chat/useChat.ts";
import {useChatStore} from "@stores/bo/scc/chat/chatStore.ts";
import type {Chat} from "@/types";
import {useSocketDetail} from "@hooks/cmm/socket/useSocket.ts";

function ChatStatusChangeButton() {
    const { chatSeq } = useChatStore();
    const { data: chatDetail } = useChatDetail(chatSeq || '');
    const { mutate: updateChatStatus } = updateChatStatusMutation();
    const { data: socketDetail } = useSocketDetail();
    const currentStatus = chatDetail?.status;
    const handleUpdateChatStatus = async (status: Chat['status']) => {
        if (socketDetail?.status !== 'open') {
            message.error('소켓이 연결된 상태가 아닙니다.');
            return;
        }
        await updateChatStatus({ chatSeq, status });
    };

    return (
        <div>
            <Space.Compact style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }} size="large">
                <>
                    <ChatMgrChangeButton chatSeq={chatSeq}/>
                    {currentStatus === '보류' && (
                        <CmmButton
                            icon={<PhoneTwoTone />}
                            onClick={() => handleUpdateChatStatus('상담중')}
                            buttonType='보류해제'
                            >
                            보류해제
                        </CmmButton>
                    )}
                    {currentStatus !== '보류' && (
                        <CmmButton
                            icon={<StopTwoTone />}
                            onClick={() => handleUpdateChatStatus('보류')}
                            buttonType='보류'
                        >
                            상담보류
                        </CmmButton>
                    )}
                </>
                <>
                    <CmmButton
                        color='red'
                        icon={<DeleteTwoTone />}
                        onClick={() => handleUpdateChatStatus('후처리')}
                        buttonType='상담종료'
                    >
                        상담종료
                    </CmmButton>
                </>
            </Space.Compact>
        </div>
    );
}

export default ChatStatusChangeButton;