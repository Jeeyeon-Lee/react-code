import React from 'react';
import {Descriptions, Typography} from "antd";
const { Text } = Typography;

function ChatDetail({chatDetail}) {
    return (
        <div>
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
                <p>검색 결과 리스트 클릭 시 상세내용이 나와요.</p>
            )}
        </div>
    );
}

export default ChatDetail;