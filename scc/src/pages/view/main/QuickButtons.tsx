import { Button, Tooltip } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, ProfileOutlined, SnippetsOutlined } from '@ant-design/icons';

function QuickButtons() {
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
                <Button type="primary" shape="circle" icon={<FileTextOutlined />} size="large" />
            </Tooltip>
            <Tooltip title="상담정보" placement="left">
                <Button type="primary" shape="circle" icon={<InfoCircleOutlined />} size="large" />
            </Tooltip>
            <Tooltip title="템플릿" placement="left">
                <Button type="primary" shape="circle" icon={<SnippetsOutlined />} size="large" />
            </Tooltip>
            <Tooltip title="기타" placement="left">
                <Button type="primary" shape="circle" icon={<ProfileOutlined />} size="large" />
            </Tooltip>
        </div>
    );
};

export default QuickButtons; 