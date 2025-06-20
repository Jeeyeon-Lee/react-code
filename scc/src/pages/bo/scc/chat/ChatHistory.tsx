import { useState } from 'react';
import { Table, Tag, Card, Drawer, theme, Button, Space } from 'antd';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import { useChatHistory } from '@hooks/bo/scc/chat/useChatHistory.ts';
import type { Chat } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import ChatDetailDrawer from "@pages/bo/scc/chat/ChatDetailDrawer.tsx";

const ChatHistory = () => {
    const [pageNation, setPageNation] = useState(10);
    const { userId } = useUserStore();
    const { data: chatList = [] } = useChatHistory(userId);
    const { token } = theme.useToken();
    const [open, setOpen] = useState(false);
    const [selectcallEndTmChatSeq, setSelectcallEndTmChatSeq] = useState<string | null>(null);

    const colorMap = {
        '대기중': 'rcallEndTm',
        '상담중': 'blue',
        '완료': 'green',
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
            dataIndex: 'callEndTm',
            key: 'callEndTm',
            sorter: (a, b) => a.callEndTm.localeCompare(b.callEndTm),
            align: 'center',
            render: (callEndTm: string) => callEndTm?.slice(0, 10) || '-'
        },
    ];

    const onRowClick = (record: Chat) => ({
        onClick: () => {
            setSelectcallEndTmChatSeq(record.chatSeq);
            setOpen(true);
        }
    });

    const onClose = () => {
        setOpen(false);
        setSelectcallEndTmChatSeq(null);
    };

    const containerStyle: React.CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        background: token.colorFillAlter,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
    };

    return (
        <div style={{ padding: 16 }}>
            <Card title="상담 내역">
                <div style={containerStyle}>
                    <Table
                        rowKey="chatSeq"
                        columns={columns}
                        dataSource={chatList}
                        onRow={onRowClick}
                        pagination={{
                            pageSize: pageNation,
                            showSizeChanger: true,
                            position: ['bottomCenter'],
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}건`,
                            onChange: (_page, pageSize) => setPageNation(pageSize),
                        }}
                        scroll={{ y: 400 }}
                    />
                <ChatDetailDrawer
                    chatSeq={selectcallEndTmChatSeq}
                    open={open}
                    onClose={() => {
                        onClose();
                        setSelectcallEndTmChatSeq(null);
                    }}
                />
                </div>
            </Card>
        </div>
    );
};

export default ChatHistory;
