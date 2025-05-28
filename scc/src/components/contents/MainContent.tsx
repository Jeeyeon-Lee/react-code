import React from 'react';
import { Row } from 'antd';
import LeftContent from '@components/contents/LeftContent';
import RightContent from '@components/contents/RightContent';


const MainLayout: React.FC = () => {

    return (
        <Row gutter={16} style={{ flex: 1 }}>
            <LeftContent />
            <RightContent />
        </Row>
    );
};

export default MainLayout; 