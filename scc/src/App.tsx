import { useState } from 'react';
import { Layout } from 'antd';
import Navbar from '@components/layout/Navbar';
import Sidebar from '@components/layout/Sidebar';
import Content from '@pages/view/common/Content';

const { Header, Footer } = Layout;

function App(){
    const [selectedNav, setSelectedNav] = useState('1');
    const [selectedSidebar, setSelectedSidebar] = useState('sub1');

    const handleNavSelect = (key: string) => {
        setSelectedNav(key);
        setSelectedSidebar('sub1');
    };

    const handleSidebarSelect = (key: string) => {
        setSelectedSidebar(key);
    };

    return (
        <Layout style={{ height: '100vh' }}>
            <Header style={{
                padding: '0 16px',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%'
            }}>
                <Navbar onNavSelect={handleNavSelect} />
            </Header>
            <Layout>
                <Sidebar
                    selectedNav={selectedNav}
                    onSidebarSelect={handleSidebarSelect}
                />
                <Content
                    selectedNav={selectedNav}
                    selectedSidebar={selectedSidebar}
                />
            </Layout>
            <Layout style={{ height: '5vh',textAlign: 'center' }}>
                <Footer>@2025 SRPOST TEST</Footer>
            </Layout>
        </Layout>
    );
};

export default App;
