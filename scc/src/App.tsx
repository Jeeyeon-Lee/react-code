// 전역 테마 (ConfigProvider, ThemeProvider)
import {Layout} from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/cmm/Content';
import 'tui-grid/dist/tui-grid.css';
import {useMenuListStore, useMenuStore} from "@stores/bo/base/menu/menuStore.ts";

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
            <Footer style={{textAlign:'center'}}>@2025 SRPOST TEST</Footer>
        </Layout>
    );
}

export default App;
