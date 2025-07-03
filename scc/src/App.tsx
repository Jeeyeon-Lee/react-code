// 전역 테마 (ConfigProvider, ThemeProvider)
import {ConfigProvider, Layout} from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/cmm/Content';
import 'tui-grid/dist/tui-grid.css';
import {useMenuListStore} from "@pages/bo/base/menu/menuStore.ts";
import {useLocation} from "react-router-dom";
import {useEffect} from "react";
import {useMenuList} from "@pages/bo/base/menu/useMenu.ts";
import koKR from 'antd/locale/ko_KR';
import {useLogin} from "@pages/cmm/login/useLogin.ts";
import {useCtiStore} from "@pages/cmm/cti/ctiStore.ts"; // antd v5+

const { Header, Footer } = Layout;

function App() {
    // menuCd 값이 M_MAIN(메인)일 경우 sidebar 예외처리
    const location = useLocation();
    const setMenuListInStore = useMenuListStore((state) => state.setMenuList);

    // 메뉴 최신화
    const { data: fetchedMenuList} = useMenuList();

    // 로그인계정 정보 Set
    const { status} = useLogin();
    const { setMgrStatus } = useCtiStore();

    useEffect(() => {

        if (fetchedMenuList) {
            setMenuListInStore(fetchedMenuList);
        }
    }, [fetchedMenuList, setMenuListInStore]); // 의존성 배열은 유지

    useEffect(() => {
        if ( status ) {
            setMgrStatus(status);
        }
    }, [status]);
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
                <ConfigProvider locale={koKR} >
                    <Content/>
                </ConfigProvider>
            </Layout>
            <Footer style={{textAlign:'center'}}>@2025 SRPOST TEST</Footer>
        </Layout>
    );
}

export default App;
