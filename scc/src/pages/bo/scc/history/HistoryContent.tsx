import {useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useChatDetail, useChatList} from "@pages/bo/scc/chat/useChat.ts";
import {useMgrList} from '@pages/bo/base/mgr/useMgr.ts';
import type {Chat} from "@pages/cmm";
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";
import {Card, Col, DatePicker, Form, Input, Row, Select} from "antd";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import { formSearch } from '@utils/salmon.ts';
import type {ColumnsType} from "antd/es/table";
import ExcelDownloadButton from "@components/form/ExcelDownloadButton.tsx";

const { RangePicker } = DatePicker;

const HistoryContent = () => {
    const [searchParams, setSearchParams] = useState<Chat>({} as Chat);
    const { data: chatList = [] } = useChatList(searchParams);
    const [selectedChatSeq, setSelectedChatSeq] = useState<string | null>(null);
    const [params] = useSearchParams();
    const urlChatSeq = params.get('chatSeq');
    const chatSeq = selectedChatSeq || urlChatSeq;

    const { data: mgrList } = useMgrList();
    const { data: chatDetail } = useChatDetail(chatSeq ?? '');
    const [form] = Form.useForm();

    const [selectedRows, setSelectedRows] = useState([]);
    const [columns, setColumns] = useState<ColumnsType>([]);

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

    const handleSubmitSearch = async <Chat>(fieldsValue: any) => {
        const values = formSearch<Chat>(fieldsValue);
        setSearchParams(values);
    };

    return (
        <>
            <CmmSearchForm
                title="상담 이력 검색"
                form={form}
                resetBtn={'리셋'}
                searchBtn={'서치'}
                extraButtons={
                    <ExcelDownloadButton<Chat>
                        data={selectedRows.length > 0 ? selectedRows : chatList}
                        columns={columns
                            .filter(col => (col.dataIndex ?? col.key) !== 'index')
                            .map(col => ({
                            key: col?.dataIndex,
                            header: col.title as string,
                        }))}
                        sheetName="상담내역"
                    />
                }
            >
                <CmmForm
                    form={form}
                    name="searchForm"
                    onFinish={handleSubmitSearch}
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item name="range-picker" label="등록일">
                                <RangePicker />
                            </Form.Item>
                        </Col>

                        <Col span={4}>
                            <Form.Item name="sk" label="키워드" initialValue="title" tooltip="키워드를 선택하신 뒤 검색어를 입력하세요.">
                                <Select style={{textAlign:'center'}}>
                                    <Select.Option value="title">제목</Select.Option>
                                    <Select.Option value="userNm">이용자</Select.Option>
                                    <Select.Option value="mgrNm">상담사</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item name="sv" label=" " colon={false} >
                                <Input placeholder="검색어를 입력하세요." />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="mgrId" label="상담사">
                                <Select
                                    options={mgrList
                                        ?.filter((mgr) => mgr.id !== '5')
                                        .map((mgr) => ({
                                            label: mgr.mgrNm,
                                            value: mgr.id
                                        }))
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="type" label="상담타입">
                                <CmmCodeSelect group="CHANNEL" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="status" label="상담상태">
                                <CmmCodeSelect group="CHAT_STATUS" />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="transferYn" label="이관여부">
                                <CmmCodeSelect group="YES_YN" />
                            </Form.Item>
                        </Col>
                    </Row>
                </CmmForm>
            </CmmSearchForm>
            <Row gutter={24}>
                <Col span={12}>
                    <Card title={`검색 결과 (총 ${chatList.length}건)`}>
                        <ChatTable
                            chatList={chatList}
                            onRowClick={onRowClick}
                            onSelectRows={setSelectedRows}
                            setColumns={setColumns}
                            scrollY={400}
                            excludeColumns={['transferYn','callStartTm','callEndTm']}
                        />
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
