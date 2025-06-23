// 전역 테마 (ConfigProvider, ThemeProvider)
import {Layout} from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/cmm/Content';
import 'tui-grid/dist/tui-grid.css';
import {useMenuListStore, useMenuStore} from "@stores/bo/base/menu/menuStore.ts";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useMenuList} from "@hooks/bo/base/menu/useMenu.ts";

const { Header, Footer } = Layout;

function App() {
    // menuCd 값이 M_MAIN(메인)일 경우 sidebar 예외처리
    const location = useLocation();
    const setMenuListInStore = useMenuListStore((state) => state.setMenuList);

    // 메뉴 최신화
    const { data: fetchedMenuList} = useMenuList();
    useEffect(() => {

        if (fetchedMenuList) {
            setMenuListInStore(fetchedMenuList);
        }
    }, [fetchedMenuList, setMenuListInStore]); // 의존성 배열은 유지

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
                {location.pathname !== '/main' && <Sidebar/>}
                <Content/>
            </Layout>
            <Footer style={{textAlign:'center'}}>@2025 SRPOST TEST</Footer>
        </Layout>
    );
}

export default App;
