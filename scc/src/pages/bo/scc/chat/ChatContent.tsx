import React, {useState} from 'react';
import ChatHeader from "@pages/bo/scc/chat/ChatHeader.tsx";
import {Button, Col, Row} from "antd";
import ChatList from "@pages/bo/scc/chat/ChatList.tsx";
import ChatForm from "@pages/bo/scc/chat/ChatForm.tsx";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import ChatHistory from "@pages/bo/scc/chat/ChatHistory.tsx";
import ChatData from "@pages/bo/scc/chat/ChatData.tsx";
import ChatTemplate from "@pages/bo/scc/chat/ChatTemplate.tsx";
import ChatEtc from "@pages/bo/scc/chat/ChatEtc.tsx";

function ChatContent({ renderCounselSelectContent }) {
    const [isCounselFormCollapsed, setIsCounselFormCollapsed] = useState(false);
    const [templateContent, setTemplateContent] = useState('');

    const toggleCounselFormCollapse = () => {
        setIsCounselFormCollapsed(!isCounselFormCollapsed);
    };

    const leftContentSpan = isCounselFormCollapsed ? 16 : 8;

    const collapseButtonLeft = isCounselFormCollapsed
        ? 'calc(66.66% - 20px)'
        : 'calc(33.33% - 20px)';

    return (
        <div>
            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                {/* ChatList (채팅창 영역) */}
                <Col span={leftContentSpan} style={{ height: '70vh', display: 'flex', flexDirection: 'column'}}>
                    <ChatList templateContent={templateContent} setTemplateContent={setTemplateContent} />
                </Col>

                <Col span={24 - leftContentSpan} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Row gutter={[16, 16]} style={{ flex: 1 }}>
                        {/* ChatForm (접히는 영역) */}
                        <Col
                            span={isCounselFormCollapsed ? 0 : 12}
                            style={{
                                display: isCounselFormCollapsed ? 'none' : 'flex',
                                flexDirection: 'column',
                                flex: isCounselFormCollapsed ? '0' : '1',
                            }}
                        >
                            <ChatForm />
                        </Col>
                        {/* renderCounselSelectContent */}
                        <Col
                            span={isCounselFormCollapsed ? 24 : 12}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1,
                            }}
                        >
                            {renderCounselSelectContent()}
                        </Col>
                    </Row>
                </Col>

                <Button
                    icon={isCounselFormCollapsed ? <LeftOutlined /> : <RightOutlined />}
                    onClick={toggleCounselFormCollapse}
                    style={{
                        position: 'absolute',
                        left: collapseButtonLeft,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 20,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        padding: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #d9d9d9',
                        backgroundColor: '#fff'
                    }}
                />
            </Row>
        </div>
    );
}

export default ChatContent;