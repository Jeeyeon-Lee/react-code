// 전역 테마 (ConfigProvider, ThemeProvider)
import {Layout} from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/view/common/Content';
import 'tui-grid/dist/tui-grid.css';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/ko';
import {useMenuListStore, useMenuStore} from "@stores/menuStore.ts";

dayjs.extend(isLeapYear);
dayjs.locale('ko');

const { Header, Footer } = Layout;

function App() {
    // menuCd 값이 M_MAIN(메인)일 경우 sidebar 예외처리
    const menuCd = useMenuStore(state => state.menuCd);
    const menuList = useMenuListStore(state => state.menuList);

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
