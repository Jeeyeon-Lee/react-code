import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
    NotificationOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined, SettingOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    const getSidebarItems = (): MenuProps['items'] => {
        switch ('2') {
            case '1':
                return [];
            case '2':
                return [
                    NotificationOutlined,
                ].map((_icon, index) => ({
                    key: `sub${index + 1}`,
                    icon: <SettingOutlined />,
                    label: `상담 관리 ${index + 1}`,
                    children: Array.from({ length: 2 }).map((_, j) => ({
                        key: `${index}-${j}`,
                        label: `상담 관리 서브메뉴 ${j + 1}`,
                    })),
                }));
            case '3':
                return [
                    NotificationOutlined,
                ].map((_icon, index) => ({
                    key: `sub${index + 1}`,
                    icon: <SettingOutlined />,
                    label: `시스템 관리 ${index + 1}`,
                    children: Array.from({ length: 2 }).map((_, j) => ({
                        key: `${index}-${j}`,
                        label: `시스템 관리 서브메뉴 ${j + 1}`,
                    })),
                }));
            default:
                return [];
        }
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
                mode="inline"
                defaultSelectedKeys={['sub1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                items={getSidebarItems()}
                onClick={({ key }) => onSidebarSelect(key)}
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