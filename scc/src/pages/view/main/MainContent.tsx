import { Row, Col, Button } from 'antd';
import { useState } from 'react';
import CounselForm from '@pages/view/main/CounselForm';
import MyCounsel from '@pages/view/main/MyCounsel';
import LeftContent from '@pages/view/main/LeftContent';
import RightPanelHeader from '@pages/view/main/RightPanelHeader';
import QuickButtons from '@pages/view/main/QuickButtons';
import CounselHistory from '@pages/view/main/CounselHistory';
import CounselData from '@pages/view/main/CounselData';
import CounselEtc from '@pages/view/main/CounselEtc';
import CounselTemplate from '@pages/view/main/CounselTemplate';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

function MainContent() {
    const [selectedView, setSelectedView] = useState<'history' | 'info' | 'template' | 'etc'>('history');
    const [isCounselFormCollapsed, setIsCounselFormCollapsed] = useState(false);
    const [templateContent, setTemplateContent] = useState('');
    const handleSelectView = (view: 'history' | 'info' | 'template' | 'etc') => {
        setSelectedView(view);
    };

    const toggleCounselFormCollapse = () => {
        setIsCounselFormCollapsed(!isCounselFormCollapsed);
    };

    const renderCounselSelectContent = () => {
        switch (selectedView) {
            case 'history':
                return <CounselHistory />;
            case 'info':
                return <CounselData />;
            case 'template':
                return <CounselTemplate />;
            case 'etc':
                return <CounselEtc />;
            default:
                return <CounselHistory />;
        }
    };

    const leftContentSpan = isCounselFormCollapsed ? 16 : 8;

    const collapseButtonLeft = isCounselFormCollapsed
        ? 'calc(66.66% - 20px)'
        : 'calc(33.33% - 20px)';


    return (
        <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                <Col span={4} style={{ display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                    <MyCounsel />
                </Col>
                <Col span={20} style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', flex: 1 }}>
                    <RightPanelHeader />
                    <Row gutter={[16, 16]} style={{ flex: 1 }}>
                        {/* LeftContent (채팅창 영역) */}
                        <Col span={leftContentSpan} style={{ height: '65vh', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)'}}>
                            <LeftContent templateContent={templateContent} setTemplateContent={setTemplateContent} />
                        </Col>

                        <Col span={24 - leftContentSpan} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                                {/* CounselForm (접히는 영역) */}
                                <Col span={isCounselFormCollapsed ? 0 : 12} style={{
                                    boxShadow: isCounselFormCollapsed ? 'none' : '0 1px 4px rgba(0.2,0.2,0.2,0.2)',
                                    display: isCounselFormCollapsed ? 'none' : 'flex',
                                    flexDirection: 'column',
                                    flex: isCounselFormCollapsed ? '0' : '1'
                                }}>
                                    <CounselForm />
                                </Col>
                                {/* 유지되는 영역 */}
                                <Col span={isCounselFormCollapsed ? 24 : 12} style={{ display: 'flex', flexDirection: 'column', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)', flex: 1 }}>
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
                </Col>
            </Row>
            {/*우측 퀵버튼*/}
            <QuickButtons onSelectView={handleSelectView} />
        </div>
    );
};

export default MainContent; 