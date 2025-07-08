import React, {useEffect, useState} from 'react';
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import {Card, Col, Form, Input, Row, Select} from "antd";
import type {Chat} from "@pages/bo/scc/chat/chat.ts";
import {deleteChatMutation, useChatDetail, useChatList} from "@pages/bo/scc/chat/useChat.ts";
import {formSearch, modal} from '@utils/salmon.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import type {ColumnsType} from "antd/es/table";
import ExcelDownloadButton from "@components/form/ExcelDownloadButton.tsx";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteOutlined} from "@ant-design/icons";
import {deleteChatSession, transferCall} from "@pages/cmm/cti/useCti.ts";
import {useChatStore} from "@pages/bo/scc/chat/chatStore.ts";

const ProcessContent = ({status}) => {
    const [searchParams, setSearchParams] = useState<Chat>({status:status} as Chat);
    const { data: chatList = [] } = useChatList(searchParams);
    const [selectedChatSeq, setSelectedChatSeq] = useState<string | null>(null);
    const { data: processDetail } = useChatDetail(selectedChatSeq ?? '');
    const [form] = Form.useForm();
    const [selectedRows, setSelectedRows] = useState([]);
    const [columns, setColumns] = useState<ColumnsType>([]);
    const { mutate: deleteChat } = deleteChatMutation();
    const { chatSeq, clearChatSeq } = useChatStore();

    const onRowClick = (record: Chat) => ({
        onClick: () => {
            setSelectedChatSeq(record.chatSeq);
        },
    });

    const handleSubmitSearch = async <Chat>(fieldsValue: any) => {
        const values = formSearch<Chat>(fieldsValue);
        setSearchParams(values);
    };

    useEffect(() => {
        setSearchParams(prev => ({ ...prev, status }));
    }, [status]);

    const handleDeleteChat = async () => {
        if (selectedRows.length === 0) {
            modal({
                type:"warning",
                title: '삭제 실패',
                content: '삭제할 데이터를 선택하세요.',
            });
            return;
        }

        modal({
            type: 'confirm',
            title: '삭제 확인',
            content: `선택한 데이터를 삭제하시겠습니까??`,
            onOk: async () => {
                await Promise.all(
                    selectedRows.map(async (row) => {
                        await deleteChat(row.chatSeq);
                        clearChatSeq();
                    })
                );
            },
            centered: true,
        });
        return;
    };

    //엑셀 no 설정
    const excelData = (selectedRows.length > 0 ? selectedRows : chatList).map((row, idx) => ({
        index: idx + 1,
        ...row,
    }));

    return (
        <>
            <CmmSearchForm
                form={form}
                extraButtons={
                    <>
                        {status.includes('진행중') &&(
                            <CmmButton
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteChat();
                                }}
                            >
                                삭제
                            </CmmButton>
                        )}
                        <ExcelDownloadButton<Chat>
                            data={excelData}
                            columns={[
                                { key: 'index', header: 'No' },
                                ...columns
                                    .filter(col => (col.dataIndex ?? col.key) !== 'index')
                                    .map(col => ({
                                        key: col.dataIndex ?? col.key ?? '',
                                        header: typeof col.title === 'string' ? col.title : '',
                                    })),
                            ]}
                            sheetName={`${status}_상담`}
                        />
                    </>
                }
            >
                <CmmForm
                    form={form}
                    name="searchForm"
                    onFinish={handleSubmitSearch}
                >
                    <Row gutter={12}>
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
                            <Form.Item name="type" label="상담타입">
                                <CmmCodeSelect group="CHANNEL" />
                            </Form.Item>
                        </Col>
                        {status.includes('진행중') &&(
                            <>
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
                            </>
                        )}
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
                            rowSelect={true}
                            excludeColumns={
                                Array.isArray(status)
                                    ? ['callWaitTm', 'callEndTm']
                                    : status != '완료'
                                        ? ['callWaitTm', 'status', 'callEndTm']
                                        : ['callWaitTm', 'status']
                            }
                        />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title={'내용'}>
                        <ChatDetail chatDetail={processDetail} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProcessContent;
