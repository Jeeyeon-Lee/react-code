import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {Col, Input, Avatar, Typography, Divider} from 'antd';
import {
    SendOutlined,
    UserOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import { useChatDetail, updateChatStatusMutation, useChatDataList} from '@hooks/bo/scc/chat/useChat.ts';
import { useLogin } from '@hooks/cmm/login/useLogin.ts';
import type { ChatData } from '@/types';
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import CmmButton from '@components/form/CmmButton.tsx';
import ChatStatusChangeButton from "@pages/bo/scc/chat/ChatStatusChangeButton.tsx";
import {useMgrDetail} from "@hooks/bo/base/mgr/useMgr.ts";
import CounselReady from "@pages/bo/scc/chat/CounselReady.tsx";
import {useUserStore} from "@stores/bo/base/user/userStore.ts";
import {useUser} from "@hooks/bo/base/user/useUser.ts";

const { Text } = Typography;

interface LeftContentProps {
    templateContent: string;
    setTemplateContent: Dispatch<SetStateAction<string>>;
}

const ChatList = ({ templateContent, setTemplateContent }: LeftContentProps) => {
    const [ messages, setMessages ] = useState<ChatData[]>([]);
    const [ inputText, setInputText ] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { chatSeq } = useChatStore();
    const { userId, setUserId } = useUserStore();
    const { loginInfo } = useLogin();
    const { useUserDetail } = useUser();
    const { data: userDetail } = useUserDetail(userId);
    const { data: chatDetail } = useChatDetail(chatSeq);
    const { data: chatData} = useChatDataList(chatSeq);
    const { data: mgrDetail } = useMgrDetail(loginInfo?.mgrId);
    const isDisabled = !!chatSeq && !(
        ['후처리', '완료', '보류', '상담중'].includes(chatDetail?.[0]?.status ?? '')
    );
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatData && chatData.length > 0) {
            const formattedMessages: ChatData[] = chatData.map((msg: any) => ({
                ...msg,
                timestamp: msg.timestamp
            }));
            setMessages(formattedMessages);
        }
    }, [chatData]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.sender === 'mgr') {
                scrollToBottom();
            }
        }
    }, [messages]);

    useEffect(() => {
        if (templateContent) {
            setInputText(templateContent);
            setTemplateContent('');
        }
    }, [templateContent, setTemplateContent]);

    const handleSend = async () => {

    };

    return (
        <Col style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
        }}>

            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100% - 60px)'
                }}
            >
                <div>
                    {userId && (
                        <>
                            <Text strong>{userDetail?.userNm}</Text>
                            <Text type="secondary" style={{marginLeft: '16px'}}>유저 아이디: {userDetail?.userId}</Text>
                            <Text type="secondary" style={{marginLeft: '16px'}}>유저 연락처: {userDetail?.mobile}</Text>
                            <Text type="secondary" style={{marginLeft: '16px'}}>채팅번호: {chatDetail?.[0].chatSeq}</Text>
                            <Text type="secondary" style={{marginLeft: '16px'}}>채팅상태: {chatDetail?.[0].status}</Text>
                        </>
                    )}
                </div>
                <Divider />
                {mgrDetail?.status === '상담준비' && (
                    <>
                        <CounselReady/>
                        <Divider />
                    </>
                )}

                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {messages.map(message => (
                        <div
                            key={`${message.chatSeq}-${message.chatNo}`}
                            style={{
                                display: 'flex',
                                justifyContent: message.sender === 'mgr' ? 'flex-end' : 'flex-start',
                                marginBottom: '16px',
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                maxWidth: '70%',
                            }}>
                                {message.sender === 'user' && (
                                    <Avatar icon={<UserOutlined/>} style={{marginRight: '8px'}}/>
                                )}
                                <div>
                                    <div style={{
                                        background: message.sender === 'mgr' ? '#1890ff' : '#f0f0f0',
                                        color: message.sender === 'mgr' ? '#fff' : '#000',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        wordBreak: 'break-word',
                                    }}>
                                        {message.text}
                                    </div>
                                    <div style={{
                                        fontSize: '12px',
                                        color: '#999',
                                        marginTop: '4px',
                                        textAlign: message.sender === 'mgr' ? 'right' : 'left'
                                    }}>
                                        {new Date(message.sendTime).toLocaleTimeString()}
                                    </div>
                                </div>
                                {message.sender === 'mgr' && (
                                    <Avatar icon={<CustomerServiceOutlined/>} style={{marginLeft: '8px'}}/>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div ref={messagesEndRef}/>
            </div>

            <div style={{
                display: 'flex',
                gap: '8px',
                padding: '8px 0'
            }}>
                <Input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onPressEnter={handleSend}
                    placeholder="답변을 입력하세요..."
                    style={{flex: 1}}
                />
                <CmmButton
                    type="primary"
                    icon={<SendOutlined/>}
                    onClick={handleSend}
                    disabled={isDisabled}
                >
                    전송
                </CmmButton>
            </div>
            <ChatStatusChangeButton isDisabled={isDisabled}/>
        </Col>
    );
};

export default ChatList; 