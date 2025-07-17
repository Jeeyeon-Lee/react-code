import ChatMgrChangeButton from "@pages/bo/scc/chat/ChatMgrChangeButton.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {
    DeleteOutlined,
    PhoneOutlined,
    StopOutlined,
    RedoOutlined,
    DownCircleOutlined
} from "@ant-design/icons";
import { Space } from "antd";
import {deleteChatMutation, updateChatStatusMutation} from "@pages/bo/scc/chat/useChat.ts";
import { useChatStore } from "@pages/bo/scc/chat/chatStore.ts";
import { callEnd, holdCall, resumeCall, changeChatStatus, deleteChatSession } from '@pages/cmm/cti/useCti.ts';
import { useUserStore } from "@pages/bo/base/user/userStore.ts";
import {useLogin} from "@pages/cmm/login/useLogin.ts";
import {useCtiStore} from "@pages/cmm/cti/ctiStore.ts";

function CallStatusChangeButton() {
    const { chatSeq, clearChatSeq } = useChatStore();
    const { mgrId } = useLogin();
    const chatStatus = useCtiStore((state) => state.chatStatusMap[chatSeq]);
    const { mutate: updateChatStatus } = updateChatStatusMutation();
    const { mutate: deleteChat } = deleteChatMutation();
    const { setUserId } = useUserStore();

    const handleDeleteChat = async () => {
        if (!chatSeq) return;
        await deleteChatSession(chatSeq, () => {
            deleteChat(chatSeq);
            clearChatSeq();
            setUserId('');
        });
    };

    const syncChatStatus = async (chatSeq: string, status: string) => {
        await changeChatStatus(chatSeq, status); // CTI 상태
        updateChatStatus({ chatSeq, status });   // DB 상태
    };

    return (
        <div>
            <Space.Compact style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }} size="large">
                
                <ChatMgrChangeButton chatSeq={chatSeq} />

                {chatStatus === '보류' && (
                    <CmmButton
                        icon={<RedoOutlined />}
                        onClick={() => resumeCall(chatSeq)}
                        buttonType='보류해제'
                    >
                        보류해제
                    </CmmButton>
                )}

                {chatStatus !== '보류' && (
                    <CmmButton
                        icon={<StopOutlined />}
                        onClick={() => holdCall(chatSeq)}
                        buttonType='보류'
                    >
                        상담보류
                    </CmmButton>
                )}

                {chatStatus === '진행중' && (
                    <CmmButton
                        icon={<PhoneOutlined />}
                        onClick={() => callEnd(mgrId, chatSeq)}
                        buttonType='전화끊기'
                    >
                        전화끊기
                    </CmmButton>
                )}

                <CmmButton
                    color='red'
                    icon={<DeleteOutlined />}
                    onClick={() => syncChatStatus(chatSeq, '후처리')}
                    buttonType='상담종료'
                >
                    상담종료
                </CmmButton>

                {chatStatus !== '완료' && (
                    <>
                        <CmmButton
                            icon={<DownCircleOutlined />}
                            onClick={() => syncChatStatus(chatSeq, '완료')}
                            buttonType='완료처리'
                        >
                            완료처리
                        </CmmButton>

                        <CmmButton
                            icon={<DeleteOutlined />}
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

export default CallStatusChangeButton;