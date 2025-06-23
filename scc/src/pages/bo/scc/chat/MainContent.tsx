import { Row, Col, Button } from 'antd';
import { useState } from 'react';
import MyChat from './MyChat.tsx';
import ChatQuickButtons from './ChatQuickButtons.tsx';
import ChatHistory from './ChatHistory.tsx';
import ChatData from './ChatData.tsx';
import ChatEtc from './ChatEtc.tsx';
import ChatTemplate from './ChatTemplate.tsx';
import ChatContent from "@pages/bo/scc/chat/ChatContent.tsx";

function Content() {
    const [selectedView, setSelectedView] = useState<'history' | 'info' | 'template' | 'etc'>('history');

    const handleSelectView = (view: 'history' | 'info' | 'template' | 'etc') => {
        setSelectedView(view);
    };

    const renderCounselSelectContent = () => {
        switch (selectedView) {
            case 'history':
                return <ChatHistory />;
            case 'info':
                return <ChatData />;
            case 'template':
                return <ChatTemplate />;
            case 'etc':
                return <ChatEtc />;
            default:
                return <ChatHistory />;
        }
    };

    return (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                <Col span={4} style={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                    <MyChat />
                </Col>
                <Col span={20} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', flex: 1 }}>
                    <ChatContent />
                </Col>
            </Row>
            {/*우측 퀵버튼*/}
            <ChatQuickButtons onSelectView={handleSelectView} />
        </div>
    );
};

export default Content;