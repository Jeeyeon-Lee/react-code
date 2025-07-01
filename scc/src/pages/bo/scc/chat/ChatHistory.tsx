import React, { useState } from 'react';
import {Table, Tag, Card, theme, Divider, Typography, Steps, Badge, Descriptions} from 'antd';
import type { DescriptionsProps } from 'antd';
import { useUserStore } from '@stores/bo/base/user/userStore.ts';
import { useChatHistory } from '@hooks/bo/scc/chat/useChatHistory.ts';
import type { Chat } from '@/types';
import type { ColumnsType } from 'antd/es/table';
import ChatDetailDrawer from "@pages/bo/scc/chat/ChatDetailDrawer.tsx";
import {useChatDetail} from "@hooks/bo/scc/chat/useChat.ts";
import {SmileOutlined, UserOutlined, SolutionOutlined} from "@ant-design/icons";

const { Text } = Typography;

const ChatHistory = ({chatSeq}) => {
    const [pageNation, setPageNation] = useState(10);
    const {userId} = useUserStore();
    const {data: chatList = []} = useChatHistory(userId);
    const {token} = theme.useToken();
    const [open, setOpen] = useState(false);
    const [selectcallEndTmChatSeq, setSelectcallEndTmChatSeq] = useState<string | null>(null);
    const {data: chatDetail} = useChatDetail(chatSeq ?? '');

    const colorMap = {
        '대기중': 'rcallEndTm',
        '상담중': 'blue',
        '완료': 'green',
        '보류': 'orange',
        '': 'gray',
    } as const;

    type StatusKey = keyof typeof colorMap;

    const columns: ColumnsType<Chat> = [
        {title: '이용자', dataIndex: 'userNm', key: 'userNm', align: 'center'},
        {
            title: '상담사',
            dataIndex: 'mgrNm',
            key: 'mgrNm',
            sorter: (a, b) => a.mgrNm.localeCompare(b.mgrNm),
            align: 'center'
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            align: 'center'
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            sorter: (a, b) => a.status?.localeCompare(b.status),
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

    const getStepStatus = (target: string) => {
        const status = chatDetail?.status;
        if (!status) return 'wait';
        if (status === '대기중') {
            return target === '인입' ? 'process' : 'wait';
        }
        if (status === '상담중' || status === '후처리' || status === '보류') {
            return target === '인입' ? 'finish' :
                target === '상담' ? 'process' : 'wait';
        }
        if (status === '완료') {
            return 'finish';
        }
        return 'wait';
    };

    return (
        <div style={{padding: 16}}>
            <Card title="상담 내역">
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    overflowY: 'auto',
                    background: token.colorFillAlter,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    height: '60vh'
                }}>
                    <Steps
                        items={[
                            {
                                title: '인입(대기)',
                                status: getStepStatus('인입'),
                                icon: <UserOutlined />,
                                description: chatDetail?.regDt
                            },
                            {
                                title: '상담',
                                status: getStepStatus('상담'),
                                icon: <SolutionOutlined />,
                            },
                            {
                                title: '완료',
                                status: getStepStatus('완료'),
                                icon: <SmileOutlined />,
                                description: chatDetail?.callEndTm || '-'
                            },
                        ]}
                    />

                    <Divider/>
                    <Text strong>기본 상담 정보</Text>
                    <Descriptions
                        bordered
                        column={4}
                        items={[
                            { key: 'title', label: '제목', span: 4, children: chatDetail?.title || '-' },
                            { key: 'user', label: '이용자', span: 2, children: chatDetail?.userNm || '-' },
                            { key: 'mgr', label: '상담사', span: 2, children: chatDetail?.mgrNm || '-' },
                            { key: 'status', label: '상태', span: 2, children: chatDetail?.status || '-' },
                            { key: 'type', label: '타입', span: 2, children: chatDetail?.type || '-' },
                            { key: 'regDt', label: '접수일시', span: 2, children: chatDetail?.regDt || '-' },
                            { key: 'callEndTm', label: '종료일시', span: 2, children: chatDetail?.callEndTm || '-' },
                        ]}
                    />
                    <Divider/>
                    <Text strong>상담이력</Text>
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
                        scroll={{y: 200}}
                        scrollToFirstRowOnChange
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
