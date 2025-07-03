import {Breadcrumb, Layout, theme} from 'antd';
import type {MenuType} from "@pages/cmm/index.ts";
import {useMenuListStore, useMenuStore} from "@pages/bo/base/menu/menuStore.ts";
import {Route, Routes, useLocation} from "react-router-dom";
import MainContent from "@pages/bo/scc/chat/MainContent.tsx";
import CodeContent from "@pages/bo/base/code/CodeContent.tsx";
import MenuContent from "@pages/bo/base/menu/MenuContent.tsx";
import ConsultContent from "@pages/bo/scc/mon/ConsultContent.tsx";
import HistoryContent from "@pages/bo/scc/history/HistoryContent.tsx";
import BbsContent from "@pages/bo/base/bbs/BbsContent.tsx";

const { Content: AntContent } = Layout;

function Content() {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const location = useLocation();
    const menuList = useMenuListStore(state => state.menuList);

    function getBreadcrumbItems (menuList: MenuType[], locationPath: string) {
        const items: String[{}] = [];

        let current = menuList.find(m => m.path === locationPath);

        while (current) {
            items.unshift({title: current.label}); // 앞에 추가해서 루트부터 순서대로
            if (current.highMenuCd === 'ROOT') break;
            current = menuList.find(m => m.menuCd === current.highMenuCd);
        }

        return items;
    };

    return (
        <Layout style={{ height: '90vh', padding: '0 24px 24px', flex: 1 }}>
            {location.pathname !== '/main' &&
                <Breadcrumb
                    items={getBreadcrumbItems(menuList, location.pathname)}
                    style={{ margin: '16px 0' }}
                />
            }
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
                <Routes>
                    <Route path="/main" exact={true} element={<MainContent/>  }></Route>
                    <Route path="/code" exact={true} element={<CodeContent/>}></Route>
                    <Route path="/menu" exact={true} element={<MenuContent/>}></Route>
                    <Route path="/notProcess" exact={true} element={<ConsultContent/>}></Route>
                    <Route path="/history" element={<HistoryContent />}></Route>
                    <Route path="/bbs/:bbsCd" exact={true} element={<BbsContent/>}></Route>
                </Routes>
                {/* 사용자 정의 라우터  components/router안에 있음*/}
            </AntContent>
        </Layout>
    );
};

export default Content;