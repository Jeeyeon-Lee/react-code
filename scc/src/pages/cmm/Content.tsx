import {Breadcrumb, Layout, theme} from 'antd';
import type {MenuType} from "@pages/cmm/index.ts";
import {useMenuListStore} from "@pages/bo/base/menu/menuStore.ts";
import {Route, Routes, useLocation} from "react-router-dom";
import MainContent from "@pages/bo/scc/chat/MainContent.tsx";
import CodeContent from "@pages/bo/base/code/CodeContent.tsx";
import MenuContent from "@pages/bo/base/menu/MenuContent.tsx";
import HistoryContent from "@pages/bo/scc/history/HistoryContent.tsx";
import BbsContent from "@pages/bo/base/bbs/core/BbsContent.tsx";
import ProcessContent from "@pages/bo/scc/process/ProcessContent.tsx";
import HelloTest from "@pages/test/HelloTest.tsx";
import BbsConfContent from "@pages/bo/base/bbs/conf/BbsConfContent.tsx";

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
                    <Route path="/notProcess" exact={true} element={<ProcessContent status="신규접수"/>}></Route>
                    <Route path="/process" element={<ProcessContent status={["진행중", "보류"]} />} />
                    <Route path="/acwProcess" exact={true} element={<ProcessContent status="후처리"/>}></Route>
                    <Route path="/complete" exact={true} element={<ProcessContent status="완료"/>}></Route>
                    <Route path="/history" element={<HistoryContent />}></Route>
                    <Route path="/bbs/core/:bbsCd" exact={true} element={<BbsContent/>}></Route>
                    <Route path="/bbs/conf" exact={true} element={<BbsConfContent/>}></Route>
                    <Route path="/hello" element={<HelloTest />} />
                </Routes>
                {/* 사용자 정의 라우터  components/router안에 있음*/}
            </AntContent>
        </Layout>
    );
};

export default Content;