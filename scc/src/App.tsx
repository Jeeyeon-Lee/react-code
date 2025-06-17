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
import AppRouter from "@components/router/AppRouter.tsx";
import {useLocation} from "react-router-dom";
import {useMenuStore} from "@stores/menuStore.ts";

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

    // menuCd 값이 M_MAIN(메인)일 경우 sidebar 예외처리
    const menuCd = useMenuStore(state => state.menuCd);

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
                <Navbar/>
            </Header>
            <Layout>
                {menuCd !== 'M_MAIN' && <Sidebar/>}
                <Content/>
            </Layout>
            <Layout style={{ height: '5vh', textAlign: 'center' }}>
                <Footer>@2025 SRPOST TEST</Footer>
            </Layout>
        </Layout>
    );
}

export default App;
