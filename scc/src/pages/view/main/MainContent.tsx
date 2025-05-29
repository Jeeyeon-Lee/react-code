import { Row, Col } from 'antd';
import CounselForm from '@pages/view/main/CounselForm';
import HistoryInfo from '@pages/view/main/HistoryInfo';
import MyCounsel from '@pages/view/main/MyCounsel';
import LeftContent from '@pages/view/main/LeftContent';
import RightPanelHeader from './RightPanelHeader';
import QuickButtons from './QuickButtons';

function MainContent() {

    return (
        <div style={{ flex: 1, padding: '16px', display: 'flex', position: 'relative' }}>
            <Row gutter={[16, 16]} style={{ flex: 1, height: '100%' }}>
                <Col span={4} style={{ height: '70vh', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                    <MyCounsel />
                </Col>
                <Col span={20} style={{ height: '70vh', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <RightPanelHeader />
                    <Row gutter={[16, 16]} style={{ flex: 1 }}>
                        <Col span={8} style={{ height: '60vh', display: 'flex', flexDirection: 'column', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                            <LeftContent />
                        </Col>
                        <Col span={16} style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
                            <Row gutter={[16, 16]} style={{ flex: 1 }}>
                                <Col span={12} style={{ height: '100%', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                                    <CounselForm />
                                </Col>
                                <Col span={12} style={{ height: '100%', boxShadow: '0 1px 4px rgba(0.2,0.2,0.2,0.2)' }}>
                                    <HistoryInfo />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <QuickButtons />
        </div>
    );
};

export default MainContent; 