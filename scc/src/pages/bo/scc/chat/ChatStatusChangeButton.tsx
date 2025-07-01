import React from 'react';
import ChatMgrChangeButton from "@pages/bo/scc/chat/ChatMgrChangeButton.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteTwoTone, DownCircleTwoTone, PhoneTwoTone, StopTwoTone} from "@ant-design/icons";
import {Space} from "antd";
import {deleteChatMutation} from "@hooks/bo/scc/chat/useChat.ts";
import {useChatStore} from "@stores/bo/scc/chat/chatStore.ts";
import {deleteChatSession} from "@hooks/bo/scc/cti/useCti.ts";
import { changeChatStatus } from "@hooks/bo/scc/cti/useCti";
import {useUserStore} from "@stores/bo/base/user/userStore.ts";
import {useCtiStore} from "@stores/bo/scc/cti/ctiStore.ts";

function ChatStatusChangeButton() {
    const { chatSeq, clearChatSeq } = useChatStore();
    const { mutate: deleteChat } = deleteChatMutation();
    const { setUserId } = useUserStore();
    const chatStatus = useCtiStore((state) => state.chatStatusMap[chatSeq]);



    const handleDeleteChat = async () => {
        if (!chatSeq) return;
        await deleteChatSession(chatSeq, () => {
            deleteChat(chatSeq);
            clearChatSeq();
            setUserId('');
        });
    };

    return (
        <div>
            <Space.Compact style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }} size="large">
                <>
                    <ChatMgrChangeButton chatSeq={chatSeq}/>
                    {chatStatus === '보류' && (
                        <CmmButton
                            icon={<PhoneTwoTone />}
                            onClick={() => changeChatStatus(chatSeq, '상담중')}
                            buttonType='보류해제'
                            >
                            보류해제
                        </CmmButton>
                    )}
                    {chatStatus !== '보류' && (
                        <CmmButton
                            icon={<StopTwoTone />}
                            onClick={() => changeChatStatus(chatSeq, '보류')}
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
                        onClick={() => changeChatStatus(chatSeq, '후처리')}
                        buttonType='상담종료'
                    >
                        상담종료
                    </CmmButton>
                </>
                {chatStatus !== '완료' && (
                    <>
                        <CmmButton
                            icon={<DownCircleTwoTone />}
                            onClick={() => changeChatStatus(chatSeq, '완료')}
                            buttonType='완료처리'
                        >
                            완료처리
                        </CmmButton>

                        <CmmButton
                            icon={<DeleteTwoTone />}
                            onClick={() => handleDeleteChat()}
                            buttonType='삭제'
                        >
                            삭제
                        </CmmButton>
                    </>
                )}
            </Space.Compact>
        </div>
    );
}

export default ChatStatusChangeButton;