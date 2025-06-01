import { Button, Tooltip } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, ProfileOutlined, SnippetsOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface QuickButtonsProps {
    onSelectView: (view: 'history' | 'info' | 'template' | 'etc') => void;
}

function QuickButtons({ onSelectView }: QuickButtonsProps) {
    const [activeView, setActiveView] = useState<'history' | 'info' | 'template' | 'etc'>('history');

    const handleButtonClick = (view: 'history' | 'info' | 'template' | 'etc') => {
        setActiveView(view);
        onSelectView(view);
    };

    return (
        <div style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 10,
        }}>
            <Tooltip title="상담내역" placement="left">
                <Button 
                    type={activeView === 'history' ? 'primary' : 'default'} 
                    shape="circle" 
                    icon={<FileTextOutlined />} 
                    size="large" 
                    onClick={() => handleButtonClick('history')}
                />
            </Tooltip>
            <Tooltip title="상담정보" placement="left">
                <Button 
                    type={activeView === 'info' ? 'primary' : 'default'} 
                    shape="circle" 
                    icon={<InfoCircleOutlined />} 
                    size="large" 
                    onClick={() => handleButtonClick('info')}
                />
            </Tooltip>
            <Tooltip title="템플릿" placement="left">
                <Button 
                    type={activeView === 'template' ? 'primary' : 'default'} 
                    shape="circle" 
                    icon={<SnippetsOutlined />} 
                    size="large" 
                    onClick={() => handleButtonClick('template')}
                />
            </Tooltip>
            <Tooltip title="기타" placement="left">
                <Button 
                    type={activeView === 'etc' ? 'primary' : 'default'} 
                    shape="circle" 
                    icon={<ProfileOutlined />} 
                    size="large" 
                    onClick={() => handleButtonClick('etc')}
                />
            </Tooltip>
        </div>
    );
}

export default QuickButtons; 