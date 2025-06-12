import { Card, Table, Tag } from 'antd';
import { useUserStore } from '@stores/userStore';
import { useChat } from '@hooks/useChat';
import type { Chat } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const CounselHistory = () => {
    const { userId } = useUserStore();
    const { useChatHistory } = useChat();
    const { data: chatList = [] } = useChatHistory(userId || '');

    /*react-query useChat 쓰기 전
    const [ chatList, setChatList] = useState<Chat[]>([]);

    const fetchChatHistory = async () => {
        if (!userId) return;
        try {
            const res = await getChatHistory(userId);
            setChatList(res);
        } catch (err) {
            console.error('채팅 목록 불러오기 실패', err);
        }
    };

    useEffect(() => {
        setChatList([]);
    }, [loginInfo?.mgrId]);

    useEffect(() => {
        fetchChatHistory();
    }, [userId]);
    */
    const colorMap = {
        '미처리': 'red',
        '처리중': 'blue',
        '처리완료': 'green',
        '보류': 'orange',
        '': 'gray',
    } as const;

    type StatusKey = keyof typeof colorMap;

    const columns: ColumnsType<Chat> = [
        { title: '이용자', dataIndex: 'userNm', key: 'userNm', align: 'center' },
        { title: '상담사', dataIndex: 'mgrNm', key: 'mgrNm', sorter: (a, b) => a.mgrNm.localeCompare(b.mgrNm), align: 'center' },
        { title: '제목', dataIndex: 'title', key: 'title', sorter: (a, b) => a.title.localeCompare(b.title), align: 'center' },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status: StatusKey) => (
                <Tag color={colorMap[status]}>{status}</Tag>
            )
        },
        { title: '유형', dataIndex: 'type', key: 'type', sorter: (a, b) => a.type.localeCompare(b.type), align: 'center' },
        { title: '종료일시', dataIndex: 'ed', key: 'ed', sorter: (a, b) => a.ed.localeCompare(b.ed), align: 'center' },
    ];


    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'}}>
                <Card title="상담 내역"></Card>
                <Table
                    rowKey="chatSeq"
                    columns={columns}
                    dataSource={chatList}
                    style={{ flex: 1 }}
                    pagination={{
                        pageSize: 5,
                        position: ['bottomCenter'],
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}건`,
                    }}
                />

            </div>
        </>
    );
};

export default CounselHistory;