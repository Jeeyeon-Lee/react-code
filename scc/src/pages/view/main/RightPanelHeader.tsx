import { Typography, Button, Space } from 'antd';
import { SearchOutlined,
         FileTextOutlined,
         CommentOutlined,
         RedoOutlined,
         CustomerServiceOutlined,
         SaveOutlined } from '@ant-design/icons';
import type {Chat, ChatData} from '@/types';
import { useEffect, useState } from 'react';
import { getChatDetail } from '@api/chatApi';

const { Text } = Typography;

function RightPanelHeader({ chatSeq }: { chatSeq: Chat['chatSeq'] }) {
    const [userNm, setUserNm] = useState('-');
    const [lastChatDate, setLastChatDate] = useState('-');
    const [lastConsultantNm, setLastConsultantNm] = useState('-');

    useEffect(() => {
        const fetchData = async () => {
            if (!chatSeq) {
                setUserNm('-');
                setLastChatDate('-');
                setLastConsultantNm('-');
                return;
            }
            try {
                const chatData: ChatData[] = await getChatDetail(chatSeq);
                if (chatData && chatData.length > 0) {
                    setUserNm(chatData[0].userNm || '-');

                    const lastMessage = chatData[chatData.length - 1];

                    try {
                        const date = new Date(lastMessage.timestamp);
                        setLastChatDate(date.toLocaleString()); // 혹은 원하는 형식으로 포맷
                    } catch (error) {
                        setLastChatDate('-');
                    }

                    if (lastMessage.sender === 'mgr') {
                        setLastConsultantNm(lastMessage.mgrNm || '-');
                    } else {
                        setLastConsultantNm('-');
                    }

                } else {
                    setUserNm('-');
                    setLastChatDate('-');
                    setLastConsultantNm('-');
                }
            } catch (error) {
                console.error(error);
                setUserNm('-');
                setLastChatDate('-');
                setLastConsultantNm('-');
            }
        };

        fetchData();
    }, [chatSeq]);

    return (
        <div style={{ padding: '8px 16px', borderBottom: '1px solid #e0e0e0', background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Text strong>{userNm}</Text>
                <div>
                    <Text type="secondary" style={{ marginRight: '16px' }}>마지막 상담일: {lastChatDate}</Text>
                    <Text type="secondary">마지막 상담사: {lastConsultantNm}</Text>
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