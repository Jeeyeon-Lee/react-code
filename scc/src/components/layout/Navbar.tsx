import type {MenuProps} from 'antd';
import {Layout, Menu} from 'antd';
import {CustomerServiceOutlined, HomeOutlined, SettingOutlined} from '@ant-design/icons';
import {useNavigate} from "react-router-dom";
import {useMenuListStore, useMenuStore} from "@stores/bo/base/menu/menuStore.ts";
import CmmButton from "@components/form/CmmButton.tsx";

const { Header } = Layout;

type MenuItem = {
    key: string;
    icon?: React.ReactNode;
    label: string;
    children?: MenuItem[];
};

function Navbar() {
    const navigate = useNavigate();
    const menuList = useMenuListStore(state => state.menuList);
    const { setMenuCd } = useMenuStore();

    const iconMap = {
        HomeOutlined: <HomeOutlined />,
        CustomerServiceOutlined: <CustomerServiceOutlined />,
        SettingOutlined: <SettingOutlined />,
        // ... 필요한 아이콘 추가
    };

    function buildMenuTree(menuList: any[], parentCd: string): MenuItem[]  {
        return menuList
            .filter(menu => menu.highMenuCd === parentCd && menu.menuCd !== parentCd)
            .map(menu => {
                const children = buildMenuTree(menuList, menu.menuCd);

                return {
                    key: menu.menuCd,
                    icon: iconMap[menu.icon?.toString().replace(/<|\/>/g, '') || ''],
                    label: menu.label,
                    children: children.length > 0 ? children : undefined,
                };
            });
    }

    const items: MenuProps['items'] = buildMenuTree(menuList, 'ROOT');

    // zustand id 값 세팅
    const handleNavbarClick: MenuProps["onClick"] = (e) => {
        setMenuCd(e.key);

        const clicked = menuList.find(m => m.menuCd === e.key);

        if (clicked) {
            navigate(clicked.path); // 이게 더 일반적인 처리 방식
        }
    };

    // logout action
    function logoutAction() {

        localStorage.clear();
        navigate('/');
    }

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

            <CmmButton onClick={() => logoutAction()}>
                로그아웃
            </CmmButton>
        </Header>
    );
};

export default Navbar; 