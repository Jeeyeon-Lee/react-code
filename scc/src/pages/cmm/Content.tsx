import {Breadcrumb, Layout, theme} from 'antd';
import AppRouter from "../../routes/AppRouter.tsx";
import type {MenuType} from "@/types";
import {useMenuListStore, useMenuStore} from "@stores/bo/base/menu/menuStore.ts";
import {useLocation} from "react-router-dom";

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
                <AppRouter></AppRouter>
                {/* 사용자 정의 라우터  components/router안에 있음*/}
            </AntContent>
        </Layout>
    );
};

export default Content;