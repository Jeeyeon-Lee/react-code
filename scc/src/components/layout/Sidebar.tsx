import {useState} from 'react';
import type {MenuProps} from 'antd';
import {Button, Layout, Menu} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {useMenuListStore, useMenuStore} from "@pages/bo/base/menu/menuStore.ts";
import type {MenuType} from "@pages/cmm";

const { Sider } = Layout;

function Sidebar() {
    const { setMenuCd } = useMenuStore();
    const menuCd = useMenuStore(state => state.menuCd);
    const menuList = useMenuListStore(state => state.menuList);
    const [collapsed, setCollapsed] = useState(false);

    // 최상위 Root 메뉴 찾기
    function findRootMenu(menuList: MenuType[], currentMenuCd: string): MenuType | null {
        let current = menuList.find(m => m.menuCd === currentMenuCd);
        while (current && current.highMenuCd !== 'ROOT') {
            current = menuList.find(m => m.menuCd === current?.highMenuCd);
        }
        return current || null;
    }

    // 사이드 메뉴 트리 구성
    function buildSidebarTree(menuList: MenuType[], parentCd: string): MenuProps['items'] {
        return menuList
            .filter(m => m.highMenuCd === parentCd && m.menuCd !== parentCd) // 무한 루프 방지
            .map(m => {
                const children = buildSidebarTree(menuList, m.menuCd);
                return {
                    key: m.menuCd,
                    label: children.length > 0 ? m.label : <Link to={m.path}>{m.label}</Link>,
                    children: children.length > 0 ? children : undefined,
                };
            });
    }

    const rootMenu = menuList.length && menuCd ? findRootMenu(menuList, menuCd) : null;

    const getSidebarItems = (): MenuProps['items'] => {
        if (!rootMenu) return [];
        return [{
            key: rootMenu.menuCd,
            icon: <SettingOutlined />,
            label: rootMenu.label,
            children: buildSidebarTree(menuList, rootMenu.menuCd),
        }];
    };

    // zustand id 값 세팅
    const handleSidebarClick: MenuProps["onClick"] = (e) => {
        setMenuCd(e.key);
    };

    return (
        <Sider
            width={200}
            style={{ background: '#fff' }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            trigger={null}
        >
            <div className="demo-logo-vertical" />
            <Menu
                onClick={handleSidebarClick}
                mode="inline"
                selectedKeys={[menuCd]}
                defaultOpenKeys={[rootMenu?.menuCd]}
                style={{ height: '100%', borderRight: 0 }}
                items={getSidebarItems()}
            />
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                }}
            />
        </Sider>
    );
};

export default Sidebar; 