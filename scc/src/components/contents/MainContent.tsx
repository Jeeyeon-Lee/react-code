import React from 'react';
import { Row } from 'antd';
import LeftContent from '../LeftContent';
import RightContent from '../RightContent';

const MainContent: React.FC = () => {
    return (
        <Row gutter={16} style={{ flex: 1 }}>
            <LeftContent />
            <RightContent />
        </Row>
    );
};

export default MainContent; 