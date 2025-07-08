import React, { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import {Col, Input, Avatar} from 'antd';
import {
    SendOutlined,
    UserOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import { useChatDataList} from '@pages/bo/scc/chat/useChat.ts';
import type { ChatData } from '@pages/cmm';
import { useChatStore } from '@pages/bo/scc/chat/chatStore.ts';
import CmmButton from '@components/form/CmmButton.tsx';
import ChatUserDetail from "@pages/bo/scc/chat/ChatUserDetail.tsx";
import CounselStatus from "@pages/bo/scc/chat/CounselStatus.tsx";

interface LeftContentProps {
    templateContent: string;
    setTemplateContent: Dispatch<SetStateAction<string>>;
}

const ChatList = ({ templateContent, setTemplateContent }: LeftContentProps) => {
    const [ messages, setMessages ] = useState<ChatData[]>([]);
    const [ inputText, setInputText ] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { chatSeq } = useChatStore();
    const { data: chatData} = useChatDataList(chatSeq);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (chatData && chatData.length > 0) {
            const formattedMessages: ChatData[] = chatData?.map((msg: any) => ({
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
            position: 'relative',
            boxShadow: '1px 0px 0px rgba(0.2,0.2,0.2,0.2)'
        }}>
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100% - 60px)'
                }}
            >
                <ChatUserDetail />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {messages?.map(message => (
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
                <CounselStatus none="작업, 후처리"/>
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
                    buttonType='전송'
                >
                    전송
                </CmmButton>
            </div>
        </Col>
    );
};

export default ChatList; 