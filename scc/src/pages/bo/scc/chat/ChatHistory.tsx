import { useState } from 'react';
import { Table, Tag, Card } from 'antd';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import { useChatHistory } from '@hooks/bo/scc/chat/useChatHistory.ts';
import type { Chat } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const ChatHistory = () => {
    const [pageNation, setPageNation] = useState(10);
    const { userId } = useUserStore();
    const { data: chatList = [] } = useChatHistory(userId);
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
        {
            title: '종료',
            dataIndex: 'ed',
            key: 'ed',
            sorter: (a, b) => a.ed.localeCompare(b.ed),
            align: 'center',
            render: (ed: string) => ed?.slice(0, 10) || '-'
        },
    ];


    return (
        <>
            <div style={{padding: 16}}>
                <Card title="상담 내역">
                    <div style={{display: 'flex', gap: '8px'}}>
                    </div>
                    <Table
                        rowKey="chatSeq"
                        columns={columns}
                        dataSource={chatList}
                        pagination={{
                            pageSize: pageNation,
                            showSizeChanger: true,
                            position: ['bottomCenter'],
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}건`,
                            onChange: (_page, pageSize) => {
                                setPageNation(pageSize);
                            }
                        }}
                        scroll={{y: 350}}
                    />
                </Card>
            </div>
        </>
    );
};

export default ChatHistory;