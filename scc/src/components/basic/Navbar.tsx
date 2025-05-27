import React from 'react';
import { Layout, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { HomeOutlined, CustomerServiceOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface NavbarProps {
    onNavSelect: (key: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavSelect }) => {
    const items1: MenuProps['items'] = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: '메인',
        },
        {
            key: '2',
            icon: <CustomerServiceOutlined />,
            label: '상담관리',
        },
        {
            key: '3',
            icon: <SettingOutlined />,
            label: '시스템관리',
        },
    ];

    return (
        <Header style={{ display: 'flex', alignItems: 'center' }}>
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                items={items1}
                style={{ flex: 1, minWidth: 0 }}
                onClick={({ key }) => onNavSelect(key)}
            />
        </Header>
    );
};

export default Navbar; 