import { Row, Col } from 'antd';
import React, { useState } from 'react';
import MyChat from './MyChat.tsx';
import ChatQuickButtons from './ChatQuickButtons.tsx';
import ChatHistory from './ChatHistory.tsx';
import ChatData from './ChatData.tsx';
import ChatEtc from './ChatEtc.tsx';
import ChatTemplate from './ChatTemplate.tsx';
import ChatContent from "@pages/bo/scc/chat/ChatContent.tsx";
import { useChatStore } from '@stores/bo/scc/chat/chatStore.ts';
import CallContent from "@pages/bo/scc/chat/CallContent.tsx";
import ChatHeader from "@pages/bo/scc/chat/ChatHeader.tsx";

function Content() {
    const [selectedView, setSelectedView] = useState<'history' | 'info' | 'template' | 'etc'>('history');
    const { chatType, chatSeq } = useChatStore();
    const handleSelectView = (view: 'history' | 'info' | 'template' | 'etc') => {
        setSelectedView(view);
    };

    const renderCounselSelectContent = () => {
        switch (selectedView) {
            case 'history':
                return <ChatHistory chatSeq={chatSeq}/>;
            case 'info':
                return <ChatData chatSeq={chatSeq} />;
            case 'template':
                return <ChatTemplate chatSeq={chatSeq} />;
            case 'etc':
                return <ChatEtc chatSeq={chatSeq} />;
            default:
                return <ChatHistory chatSeq={chatSeq} />;
        }
    };

    return (
        <div style={{ flex: 1, padding: '10px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                <Col span={4} style={{ display: 'flex', flexDirection: 'column'}}>
                    <MyChat />
                </Col>
                <Col span={20} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', flex: 1 }}>
                    <ChatHeader />
                    { chatType === '콜'
                        ? <CallContent renderCounselSelectContent={renderCounselSelectContent}/>
                        : <ChatContent renderCounselSelectContent={renderCounselSelectContent}/>
                    }
                </Col>
            </Row>
            {/*우측 퀵버튼*/}
            <ChatQuickButtons onSelectView={handleSelectView} />
        </div>
    );
};

export default Content;