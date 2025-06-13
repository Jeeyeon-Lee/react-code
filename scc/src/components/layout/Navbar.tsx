import React, {useEffect, useState} from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, CustomerServiceOutlined, SettingOutlined } from '@ant-design/icons';
import {Link, useLocation} from "react-router-dom";
import type {MenuType} from '@/types';
import {getMenuList} from "@api/menusApi.ts";

const { Header } = Layout;

function Navbar() {

    const [menuList, setMenuList] = useState<MenuType[]>([]);
    const location = useLocation();

    const iconMap: { [key: string] } = {
        HomeOutlined: <HomeOutlined />,
        CustomerServiceOutlined: <CustomerServiceOutlined />,
        SettingOutlined: <SettingOutlined />,
    };

    //메뉴 리스트
    const fetchMenus = async () => {
        try {
            const res = await getMenuList();
            setMenuList(res.data);
        } catch (err) {
            console.error('채팅 목록 불러오기 실패', err);
        }
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const items: MenuProps['items'] = menuList.map(menu => ({
        key: menu.path,
        icon: iconMap[menu.icon?.replace(/<|\/>/g, '') || ''],
        label: <Link to={menu.path}>{menu.label}</Link>
    }))

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />

            <Menu
                theme={"dark"}
                mode="horizontal"
                selectedKeys={[location.pathname]} // 현재 URL과 일치하는 메뉴 하이라이트
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    );
};

export default Navbar; 