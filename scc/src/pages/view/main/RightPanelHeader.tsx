import { Typography, Button, Space } from 'antd';
import { SearchOutlined,
         FileTextOutlined,
         CommentOutlined,
         RedoOutlined,
         CustomerServiceOutlined,
         SaveOutlined } from '@ant-design/icons';

const { Text } = Typography;

function RightPanelHeader() {
    return (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong>홍길동</Text>
                <div>
                    <Text type="secondary" style={{ marginRight: '16px' }}>마지막 상담일: 2024-05-23</Text>
                    <Text type="secondary">마지막 상담사: 김철수</Text>
                </div>
            </div>

            <Space size="small">
                <Button icon={<FileTextOutlined />}>번호표기</Button>
                <Button icon={<SearchOutlined />}>검색</Button>
                <Button icon={<CommentOutlined />}>메모</Button>
                <Button icon={<RedoOutlined />}>다시쓰기</Button>
                <Button icon={<CustomerServiceOutlined />}>다시듣기</Button>
                <Button type="primary" icon={<SaveOutlined />}>저장</Button>
            </Space>
        </div>
    );
};

export default RightPanelHeader; 