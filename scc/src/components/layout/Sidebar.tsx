import {useState} from 'react';
import type {MenuProps} from 'antd';
import {Button, Layout, Menu} from 'antd';
import {MenuFoldOutlined, MenuUnfoldOutlined, NotificationOutlined, SettingOutlined} from '@ant-design/icons';
import {Link} from "react-router-dom";
import {useMenuListStore, useMenuStore} from "@stores/bo/base/menu/menuStore.ts";
import type {MenuType} from "@/types";

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

    // 사이드 메뉴 배열 값
    function findChildren(menuList: MenuType[], parentCd: string): MenuType[] {
        return menuList.filter(m => m.highMenuCd === parentCd);
    }

    const rootMenu = menuList.length && menuCd ? findRootMenu(menuList, menuCd) : null;
    const sideMenus = rootMenu ? findChildren(menuList, rootMenu.menuCd) : [];

    const getSidebarItems = (): MenuProps['items'] => {
        return [
            NotificationOutlined,
        ].map((_icon, index) => ({
            key: rootMenu?.menuCd,
            icon: <SettingOutlined />,
            label: rootMenu?.label,
            children: sideMenus.map(child => ({
                key: child.menuCd,
                label: <Link to={child.path}>{child.label}</Link>,
            }))
        }));
    };

    // zustand id 값 세팅
    const handleSidebarClick: MenuProps["onClick"] = (e) => {
        setMenuCd(e.key);
    };

    // main 페이지면 return null
    //if(menuCd === 'M_MAIN') return null;

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
                openKeys={[rootMenu?.menuCd]}
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