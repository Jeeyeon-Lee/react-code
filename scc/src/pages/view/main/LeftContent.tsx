import { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Col, Input, Button, Avatar } from 'antd';
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type {Chat} from '@/types';
import { getChatDetail } from '@api/chatApi';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'mgr';
    timestamp: string;
    chatSeq: number;
    chatNo: number;
    userId: number;
    userNm: string;
    mgrNm: string;
}

interface LeftContentProps {
    chatSeq: Chat['chatSeq'];
    templateContent: string;
    setTemplateContent: Dispatch<SetStateAction<string>>;
}

const LeftContent = ({ chatSeq, templateContent, setTemplateContent }: LeftContentProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChatMessages = async () => {
        if (!chatSeq) return;

        try {
            const res = await getChatDetail(chatSeq);
            const formattedMessages: Message[] = res.map((msg: any) => ({
                ...msg,
                timestamp: msg.timestamp
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('채팅 데이터 가져오기 실패:', error);
        }
    }

    useEffect(() => {
        fetchChatMessages();
    }, [chatSeq]);

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
        if (!inputText.trim() && fileList.length === 0) return;

        const newMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'mgr',
            timestamp: new Date().toISOString(),
            chatSeq,
            chatNo: messages.length + 1,
            userId: 0,
            userNm: '',
            mgrNm: '',
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setFileList([]);

        setTimeout(() => {
            const userResponse: Message = {
                id: Date.now() + 1,
                text: "문의 사항이 있습니다.",
                sender: 'user',
                timestamp: new Date().toISOString(),
                chatSeq,
                chatNo: messages.length + 2,
                userId: 0,
                userNm: '',
                mgrNm: '',
            };
            setMessages(prev => [...prev, userResponse]);
        }, 2000);
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
                <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                                    <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
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
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </div>
                                </div>
                                {message.sender === 'mgr' && (
                                    <Avatar icon={<CustomerServiceOutlined />} style={{ marginLeft: '8px' }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef} />
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
                    style={{ flex: 1 }}
                />
                <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                >
                    전송
                </Button>
            </div>
        </Col>
    );
};

export default LeftContent; 