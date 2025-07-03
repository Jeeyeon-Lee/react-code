import React, { useState } from 'react';
import {Card, theme, Divider, Typography, Steps, Descriptions} from 'antd';
import { useUserStore } from '@pages/bo/base/user/userStore.ts';
import { useChatHistory } from '@pages/bo/scc/chat/useChatHistory.ts';
import type { Chat } from '@pages/cmm';
import ChatDetailDrawer from "@pages/bo/scc/chat/ChatDetailDrawer.tsx";
import {useChatDetail} from "@pages/bo/scc/chat/useChat.ts";
import {SmileOutlined, UserOutlined, SolutionOutlined} from "@ant-design/icons";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";

const { Text } = Typography;

const ChatHistory = ({chatSeq}) => {
    const {userId} = useUserStore();
    const {data: chatList = []} = useChatHistory(userId);
    const {token} = theme.useToken();
    const [open, setOpen] = useState(false);
    const [selectcallEndTmChatSeq, setSelectcallEndTmChatSeq] = useState<string | null>(null);
    const {data: chatDetail} = useChatDetail(chatSeq ?? '');


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
                    <ChatTable chatList={chatList} onRowClick={onRowClick} />
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
