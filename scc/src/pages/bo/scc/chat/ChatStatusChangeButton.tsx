import React from 'react';
import ChatMgrChangeButton from "@pages/bo/scc/chat/ChatMgrChangeButton.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteTwoTone, PhoneTwoTone, StopTwoTone} from "@ant-design/icons";
import {Space} from "antd";
import {updateChatStatusMutation, useChatDetail} from "@hooks/bo/scc/chat/useChat.ts";
import {useChatStore} from "@stores/bo/scc/chat/chatStore.ts";
import type {Chat} from "@/types";

function ChatStatusChangeButton({isDisabled, status}) {
    const { chatSeq } = useChatStore();
    const { data: chatDetail } = useChatDetail(chatSeq || '');
    const { mutate: updateChatStatus } = updateChatStatusMutation();
    const currentStatus = chatDetail?.[0].status;
    const handleUpdateChatStatus = async (status: Chat['status']) => {
        await updateChatStatus({ chatSeq, status });
    };

    return (
        <div>
            <Space.Compact style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }} size="large">
                <>
                    <ChatMgrChangeButton chatSeq={chatSeq} disabled={isDisabled}/>
                    {currentStatus === '보류' && (
                        <CmmButton icon={<PhoneTwoTone />} onClick={() => handleUpdateChatStatus('상담중')} disabled={isDisabled}>
                            보류해제
                        </CmmButton>
                    )}
                    {currentStatus !== '보류' && (
                        <CmmButton icon={<StopTwoTone />} onClick={() => handleUpdateChatStatus('보류')} disabled={isDisabled}>
                            상담보류
                        </CmmButton>
                    )}
                </>
                <>
                    <CmmButton color='red' icon={<DeleteTwoTone />} onClick={() => handleUpdateChatStatus('후처리')} disabled={isDisabled}>
                        상담종료
                    </CmmButton>
                </>
            </Space.Compact>
        </div>
    );
}

export default ChatStatusChangeButton;