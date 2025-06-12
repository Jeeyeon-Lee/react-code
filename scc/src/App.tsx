// 전역 테마 (ConfigProvider, ThemeProvider)
import { useState } from 'react';
import { Layout } from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/view/common/Content';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './query/queryClient';
import 'tui-grid/dist/tui-grid.css';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/ko';

dayjs.extend(isLeapYear);
dayjs.locale('ko');

const { Header, Footer } = Layout;

/* 클라이언트 : zustand 사용 / 서버 : react-query(tanstac query) */
function App() {
    return (
        <QueryClientProvider client={queryClient}>{/*react query 서버 상태관리*/}
            <AppContent />
        </QueryClientProvider>
    );
}

function AppContent() {
    const [selectedNav, setSelectedNav] = useState('1');
    const [selectedSidebar, setSelectedSidebar] = useState('sub1');

    const handleNavSelect = (key: string) => {
        setSelectedNav(key);
        setSelectedSidebar('sub1');
    };

    const handleSidebarSelect = (key: string) => {
        setSelectedSidebar(key);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header
                style={{
                    padding: '0 16px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%'
                }}
            >
                <Navbar onNavSelect={handleNavSelect} />
            </Header>
            <Layout>
                <Sidebar
                    selectedNav={selectedNav}
                    onSidebarSelect={handleSidebarSelect}
                />
                <Content
                    selectedNav={selectedNav}
                    selectedSidebar={selectedSidebar}
                />
            </Layout>
            <Layout style={{ height: '5vh', textAlign: 'center' }}>
                <Footer>@2025 SRPOST TEST</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
