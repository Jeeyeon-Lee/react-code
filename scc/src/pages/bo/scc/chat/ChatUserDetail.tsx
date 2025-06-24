import React from 'react';
import {Divider, Typography} from "antd";
import {useUserStore} from "@stores/bo/base/user/userStore.ts";
import {useUser} from "@hooks/bo/base/user/useUser.ts";
import {useChatDetail} from "@hooks/bo/scc/chat/useChat.ts";
import {useChatStore} from "@stores/bo/scc/chat/chatStore.ts";

const { Text } = Typography;

function ChatUserDetail(props) {
    const { userId} = useUserStore();
    const { chatSeq} = useChatStore();
    const { useUserDetail } = useUser();
    const { data: userDetail } = useUserDetail(userId);
    const { data: chatDetail } = useChatDetail(chatSeq);
    return (
        <>
            <div>
                {userId && (
                    <>
                        <Text strong>{userDetail?.userNm}</Text>
                        <Text type="success" style={{marginLeft: '16px'}}>( {chatDetail?.status} )</Text><br/>
                        <Text type="secondary">아이디: {userDetail?.userId}</Text>
                        <Text type="secondary" style={{marginLeft: '16px'}}>연락처: {userDetail?.mobile}</Text>
                        <Text type="secondary" style={{marginLeft: '16px'}}>채팅번호: {chatDetail?.chatSeq}</Text>
                    </>
                )}
            </div>
            <Divider/>
        </>
)
    ;
}

export default ChatUserDetail;