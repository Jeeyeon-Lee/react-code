import React from 'react';
import {Drawer, Button, Divider, Typography, Timeline, Steps, Descriptions} from 'antd';
import { useChatDetail } from '@hooks/bo/scc/chat/useChat.ts';
import {SmileOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

// ChatDetailDrawer.tsx
interface ChatDetailDrawerProps {
    chatSeq: string | null;
    open: boolean;
    onClose: () => void;
}
const { Text } = Typography;

const ChatDetailDrawer = ({ chatSeq, open, onClose }: ChatDetailDrawerProps) => {
    const { data: chatDetail } = useChatDetail(chatSeq ?? '');

    return (
        <Drawer
            title="상담 상세"
            open={open}
            onClose={onClose}
            getContainer={false}
            extra={
                <>
                    <Button>자세히</Button>
                    <Button onClick={onClose}>닫기</Button>
                </>
            }
        >
            {chatDetail ? (
                <>
                    <Text strong>기본 상담 정보</Text>
                    <Descriptions
                        bordered
                        column={2}
                        items={[
                            { key: 'title', label: '제목', span: 2, children: chatDetail?.title || '-' },
                            { key: 'chatSeq', label: 'chatSeq', span: 2, children: chatDetail?.chatSeq || '-' },
                            { key: 'user', label: '이용자', span: 2, children: chatDetail?.userNm || '-' },
                            { key: 'mgr', label: '상담사', span: 2, children: chatDetail?.mgrNm || '-' },
                            { key: 'status', label: '상태', span: 2, children: chatDetail?.status || '-' },
                            { key: 'type', label: '타입', span: 2, children: chatDetail?.type || '-' },
                            { key: 'regDt', label: '접수일시', span: 2, children: chatDetail?.regDt || '-' },
                            { key: 'callEndTm', label: '종료일시', span: 2, children: chatDetail?.callEndTm || '-' },
                        ]}
                    />
                </>
            ) : (
                <p>상세 정보를 불러오는 중...</p>
            )}
        </Drawer>
    );
};

export default ChatDetailDrawer;