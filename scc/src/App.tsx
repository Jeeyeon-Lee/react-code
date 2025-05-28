import React, { useState } from 'react';
import { Layout } from 'antd';
import Navbar from './components/basic/Navbar.tsx';
import Sidebar from './components/basic/Sidebar.tsx';
import Content from './components/basic/Content';
import Footer from './components/basic/Footer';

// @ts-ignore
const { Header, Content: AntContent } = Layout;

const App: React.FC = () => {
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
        <Layout style={{ minHeight: '100vh' }}>
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
                <Footer />
            </Layout>
        </Layout>
    );
};

export default App;
