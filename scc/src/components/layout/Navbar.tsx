import React, {useEffect, useState} from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, CustomerServiceOutlined, SettingOutlined } from '@ant-design/icons';
import {Link, useLocation, useNavigate} from "react-router-dom";
import type {MenuType} from '@/types';
import {getMenuList} from "@api/menusApi.ts";
import {useMenuStore} from "@stores/menuStore.ts";
import {useMenu} from "@hooks/useMenu.ts";

const { Header } = Layout;

function Navbar() {
    const navigate = useNavigate();

    const { useMenuList } = useMenu();
    const { setMenuCd } = useMenuStore();

    const {data: menuList = []} = useMenuList('', '');

    const iconMap: { [key: string] } = {
        HomeOutlined: <HomeOutlined />,
        CustomerServiceOutlined: <CustomerServiceOutlined />,
        SettingOutlined: <SettingOutlined />,
    };

    const items: MenuProps['items'] = menuList
        .filter(menu => menu.menuCd !== 'ROOT' && menu.highMenuCd === 'ROOT')
        .map(menu => {
            const children = menuList
                .filter(child => child.highMenuCd === menu.menuCd)
                .map(child => ({
                    key: child.menuCd,
                    label: child.label,
                }));

            return {
                key: menu.menuCd,
                icon: iconMap[menu.icon?.replace(/<|\/>/g, '') || ''],
                label: menu.label,
                children: children.length > 0 ? children : undefined, // 👈 핵심
            };
        });

    // zustand id 값 세팅
    const handleNavbarClick: MenuProps["onClick"] = (e) => {
        setMenuCd(e.key);

        const clicked = menuList.find(m => m.menuCd === e.key);
        if (clicked) {
            navigate(clicked.path); // 이게 더 일반적인 처리 방식
        }
    };

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />

            <Menu
                onClick={handleNavbarClick}
                theme={"dark"}
                mode="horizontal"
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    );
};

export default Navbar; 