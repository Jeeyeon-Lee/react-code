import React from 'react';
import { Layout, Breadcrumb, DatePicker, Row } from 'antd';
import { theme } from 'antd';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

const { Content, Footer } = Layout;

interface MainLayoutProps {
    selectedNav: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ selectedNav }) => {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    return (
        <Layout style={{ padding: '0 24px 24px', flex: 1 }}>
            <Breadcrumb
                items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                style={{ margin: '16px 0' }}
            />
            <Content
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: colorBgContainer,
                    borderRadius: borderRadiusLG,
                    padding: '24px',
                }}
            >
                <Row gutter={16} style={{ flex: 1 }}>
                    <LeftContent selectedNav={selectedNav} />
                    <RightContent selectedNav={selectedNav} />
                </Row>
            </Content>

            <Footer style={{ textAlign: 'center' }}>@2025 SRPOST TEST</Footer>
        </Layout>
    );
};

export default MainLayout; 