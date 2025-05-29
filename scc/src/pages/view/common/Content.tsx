import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { theme } from 'antd';
import MainContent from '@pages/view/main/MainContent';
import ConsultContent from '@pages/view/consult/ConsultContent';
import SystemContent from '@pages/view/system/SystemContent';

const { Content: AntContent } = Layout;

interface ContentProps {
    selectedNav: string;
    selectedSidebar: string;
}

const Content: React.FC<ContentProps> = ({ selectedNav, selectedSidebar }) => {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const renderContent = () => {
        switch (selectedNav) {
            case '1':
                return <MainContent />;
            case '2':
                return <ConsultContent />;
            case '3':
                return <SystemContent />;
            default:
                return (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <h2>선택된 메뉴: {selectedNav}</h2>
                        <h3>선택된 사이드바: {selectedSidebar}</h3>
                    </div>
                );
        }
    };

    const getBreadcrumbItems = () => {
        const items = [
            { title: 'Home' },
            { title: selectedNav === '1' ? 'Main' : 
                     selectedNav === '2' ? '상담관리' : 
                     selectedNav === '3' ? '시스템관리' : '기타' }
        ];

        if (selectedSidebar) {
            items.push({ title: `서브메뉴 ${selectedSidebar}` });
        }

        return items;
    };

    return (
        <Layout style={{ height: '90vh', padding: '0 24px 24px', flex: 1 }}>
            <Breadcrumb
                items={getBreadcrumbItems()}
                style={{ margin: '16px 0' }}
            />
            <AntContent
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    padding: '5px',
                }}
            >
                {renderContent()}
            </AntContent>
        </Layout>
    );
};

export default Content; 