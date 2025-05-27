import React, { useState, useRef, useEffect } from 'react';
import { Col, Input, Button, Avatar, Upload, message, Tooltip } from 'antd';
import { SendOutlined, PaperClipOutlined, UserOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'consultant';
    timestamp: Date;
    files?: UploadFile[];
}

const LeftContent: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "안녕하세요, 상담사님. 문의드립니다.",
            sender: 'user',
            timestamp: new Date(Date.now() - 3600000),
        },
        {
            id: 2,
            text: "네, 안녕하세요. 어떤 문의사항이 있으신가요?",
            sender: 'consultant',
            timestamp: new Date(Date.now() - 3500000),
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim() && fileList.length === 0) return;

        // 상담사 메시지 추가
        const consultantMessage: Message = {
            id: Date.now(),
            text: inputText,
            sender: 'consultant',
            timestamp: new Date(),
            files: fileList.length > 0 ? [...fileList] : undefined,
        };
        setMessages(prev => [...prev, consultantMessage]);
        setInputText('');
        setFileList([]);

        // 사용자 응답 시뮬레이션 (실제로는 API 호출 등으로 대체)
        setTimeout(() => {
            const userMessage: Message = {
                id: Date.now() + 1,
                text: "네, 알겠습니다. 답변 감사합니다.",
                sender: 'user',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
        }, 2000);
    };

    const renderFileList = (files?: UploadFile[]) => {
        if (!files || files.length === 0) return null;
        
        return (
            <div style={{ marginTop: '8px' }}>
                {files.map(file => (
                    <div key={file.uid} style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        gap: '8px',
                        background: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginBottom: '4px'
                    }}>
                        <PaperClipOutlined />
                        <span>{file.name}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Col span={12} style={{ 
            background: '#f6cbcb', 
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '80vh', // 고정된 높이 설정
            position: 'relative' // 상대 위치 설정
        }}>
            <div style={{ 
                flex: 1,
                overflowY: 'auto',
                marginBottom: '16px',
                padding: '16px',
                background: '#fff',
                borderRadius: '8px',
                height: 'calc(100% - 80px)', // 입력창 높이를 제외한 나머지 공간
                position: 'absolute', // 절대 위치 설정
                top: '16px',
                left: '16px',
                right: '16px',
                bottom: '80px'
            }}>
                {messages.map(message => (
                    <div
                        key={message.id}
                        style={{
                            display: 'flex',
                            justifyContent: message.sender === 'consultant' ? 'flex-end' : 'flex-start',
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
                                    background: message.sender === 'consultant' ? '#1890ff' : '#f0f0f0',
                                    color: message.sender === 'consultant' ? '#fff' : '#000',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    wordBreak: 'break-word',
                                }}>
                                    {message.text}
                                </div>
                                {renderFileList(message.files)}
                                <div style={{ 
                                    fontSize: '12px', 
                                    color: '#999',
                                    marginTop: '4px',
                                    textAlign: message.sender === 'consultant' ? 'right' : 'left'
                                }}>
                                    {message.timestamp.toLocaleTimeString()}
                                </div>
                            </div>
                            {message.sender === 'consultant' && (
                                <Avatar icon={<CustomerServiceOutlined />} style={{ marginLeft: '8px' }} />
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div style={{ 
                display: 'flex', 
                gap: '8px',
                position: 'absolute', // 절대 위치 설정
                bottom: '16px',
                left: '16px',
                right: '16px',
                background: '#f6cbcb',
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