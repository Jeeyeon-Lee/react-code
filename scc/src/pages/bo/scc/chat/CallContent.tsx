import React, { useState } from 'react';
import { Col, Row } from 'antd';
import ChatForm from '@pages/bo/scc/chat/ChatForm.tsx';
import ChatUserDetail from '@pages/bo/scc/chat/ChatUserDetail.tsx';
import CounselStatus from '@pages/bo/scc/chat/CounselStatus.tsx';

function CallContent({ renderCounselSelectContent }) {
    const [templateContent, setTemplateContent] = useState('');

    return (
        <div>
            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                {/* 좌측 영역: 상세정보 + 상태 + 상담입력 */}
                <Col span={12} style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '70vh',
                }}>
                    <div
                        style={{
                            flex: 1,
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <ChatUserDetail/>
                        <ChatForm/>
                        <CounselStatus/>
                    </div>
                </Col>

                {/* 우측 영역: 선택된 상담정보 */}
                <Col span={12} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {renderCounselSelectContent()}
                </Col>
            </Row>
        </div>
    );
}

export default CallContent;
