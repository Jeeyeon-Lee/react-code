import type {MenuProps} from 'antd';
import {Badge, Layout, Menu, Popover} from 'antd';
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
    const content = (
        <div style={{display: 'flex', flexWrap: 'wrap', rowGap: 12}}>
            {[
                {label: '총 통화', value: '00:00:00'},
                {label: '평균통화', value: '00:00:00'},
                {label: '상담대기', value: '00:00:00'},
                {label: '후처리', value: '00:00:00'},
                {label: '자리비움', value: '00:00:00'},
                {label: '전체콜', value: '0/0'},
                {label: '평균콜', value: '0/0'},
                {label: '본인콜', value: '0/0'},
            ].map((item, idx) => (
                <div key={idx} style={{width: 100, textAlign: 'center', marginRight: 5}}>
                    <div style={{fontSize: 14, fontWeight: 500, color: '#333'}}>{item.label}</div>
                    <div style={{fontSize: 16, fontWeight: 700}}>{item.value}</div>
                </div>
            ))}
        </div>
    );

    // logout action
    function logoutAction() {

        localStorage.clear();
        navigate('/');
    }

    return (
        <Header style={{display: 'flex', alignItems: 'center'}}>
            <div className="demo-logo"/>

            <Menu
                onClick={handleNavbarClick}
                theme={"dark"}
                mode="horizontal"
                items={items}
                style={{flex: 1, minWidth: 0}}
            />

            <Popover
                placement="bottomLeft"
                // title="현황"
                content={content}
                trigger="hover">
                <CmmButton style={{marginRight:'5px'}}>상담현황</CmmButton>
            </Popover>

            <CmmButton onClick={() => logoutAction()}>
                로그아웃
            </CmmButton>
        </Header>
    );
};

export default Navbar; 