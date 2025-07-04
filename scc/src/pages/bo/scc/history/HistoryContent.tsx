import {useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useChatDetail, useChatList} from "@pages/bo/scc/chat/useChat.ts";
import type {Chat} from "@pages/cmm";
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";
import {Card, Col, Form, Input, Row, Select} from "antd";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";
import CmmForm from "@components/form/CmmForm.tsx";

const HistoryContent = () => {
    const [params] = useSearchParams();
    const [selectedChatSeq, setSelectedChatSeq] = useState<string | null>(null);
    const urlChatSeq = params.get('chatSeq');
    const chatSeq = selectedChatSeq || urlChatSeq;

    const { data: chatList = [] } = useChatList({});
    const { data: chatDetail } = useChatDetail(chatSeq ?? '');

    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useState<Chat | null>(null);

    useEffect(() => {
        if (urlChatSeq) {
            setSelectedChatSeq(urlChatSeq);
        }
    }, [urlChatSeq]);

    const onRowClick = (record: Chat) => ({
        onClick: (e) => {
            e.preventDefault();
            setSelectedChatSeq(record.chatSeq);
        },
    });

    const handleSubmitSearch = (fieldsValue: any) => {

        const rangeValue = fieldsValue['range-picker'];

        const values = {
            ...fieldsValue,
            sd: rangeValue && rangeValue[0].format('YYYY-MM-DD'),
            ed: rangeValue && rangeValue[1].format('YYYY-MM-DD'),
        };

        setSearchParams(values);
    };

    return (
        <>
            <CmmSearchForm
                title="상담 이력 검색"
                form={form}
            >
                <CmmForm
                    form={form}
                    name="searchForm"
                    onFinish={handleSubmitSearch}
                >
                    <Form.Item name="userNm" label="이용자">
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="상태">
                        <Select>
                            <Select.Option value="대기중">대기중</Select.Option>
                            <Select.Option value="상담중">상담중</Select.Option>
                        </Select>
                    </Form.Item>
                </CmmForm>
            </CmmSearchForm>
            <Row gutter={24}>
                <Col span={12}>
                    <Card title={'검색 결과'}>
                        <ChatTable chatList={chatList} onRowClick={onRowClick} scrollY={400} />
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
