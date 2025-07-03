import {useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useChatDetail, useChatList} from "@pages/bo/scc/chat/useChat.ts";
import type {Chat} from "@pages/cmm";
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";
import {Card, Col, Form, Input, Row, Select} from "antd";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";

const HistoryContent = () => {
    const [searchParams] = useSearchParams();
    const [selectedChatSeq, setSelectedChatSeq] = useState<string | null>(null);

    const urlChatSeq = searchParams.get('chatSeq');
    const chatSeq = selectedChatSeq || urlChatSeq;

    const { data: chatList = [] } = useChatList({});
    const { data: chatDetail } = useChatDetail(chatSeq ?? '');

    // URL에 chatSeq 있을 경우 초기 설정
    useEffect(() => {
        if (urlChatSeq) {
            setSelectedChatSeq(urlChatSeq);
        }
    }, [urlChatSeq]);

    const onRowClick = (record: Chat) => ({
        onClick: () => {
            setSelectedChatSeq(record.chatSeq);
        },
    });

    return (
        <>
            <CmmSearchForm>
                <>
                    <Form.Item name="userNm" label="이용자">
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="상태">
                        <Select>
                            <Option value="대기중">대기중</Option>
                            <Option value="상담중">상담중</Option>
                        </Select>
                    </Form.Item>
                </>
            </CmmSearchForm>
            <Row gutter={24}>
                <Col span={12}>
                    <Card title={'검색 결과'}>
                        <ChatTable chatList={chatList} onRowClick={onRowClick} scrollY={500} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={'내용'}>
                        <ChatDetail chatDetail={chatDetail} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default HistoryContent;
