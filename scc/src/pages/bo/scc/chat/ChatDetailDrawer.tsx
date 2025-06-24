import React from 'react';
import { Drawer, Button, Divider, Typography, Timeline } from 'antd';
import { useChatDetail } from '@hooks/bo/scc/chat/useChat.ts';

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
            extra={<Button onClick={onClose}>닫기</Button>}
        >
            {chatDetail ? (
                <>
                    <Text strong>기본 상담 정보</Text>
                    {/*
                    chatDetail.status 상담상태 : 대기중, 상담중, 완료, 보류, 후처리
                    ant timeline
                    chatDetail.callStartTm : 상담시작
                    chatDetail.callEndTm : 완료
                    chatFormData.regDt

                    */}
                    <Timeline
                        pending="Recording..."
                        items={[
                            {
                                children: '대기중',
                            },
                            {
                                children: '상담중',
                            },
                            {
                                children: '보류',
                            },
                            {
                                children: '보류해제',
                            },
                            {
                                children: '후처리',
                            },
                        ]}
                    />
                    <Divider />
                    <Text strong>기본 상담 정보</Text>
                    <p><strong>이용자:</strong> {chatDetail?.userNm}</p>
                    <p><strong>상담사:</strong> {chatDetail?.mgrNm}</p>
                    <p><strong>상태:</strong> {chatDetail?.status}</p>
                    <p><strong>제목:</strong> {chatDetail?.title}</p>
                    <Divider />
                </>
            ) : (
                <p>상세 정보를 불러오는 중...</p>
            )}
        </Drawer>
    );
};

export default ChatDetailDrawer;