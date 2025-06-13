import React from 'react';
import { Layout, Breadcrumb } from 'antd';
import { theme } from 'antd';
import AppRouter from "@components/router/AppRouter.tsx";

const { Content: AntContent } = Layout;

function Content() {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

    const getBreadcrumbItems = () => {
        const items = [
            { title: 'Home' },
            { title: 'Main' }
        ];

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
                <AppRouter></AppRouter>
                {/* 사용자 정의 라우터  components/router안에 있음*/}
            </AntContent>
        </Layout>
    );
};

export default Content; 