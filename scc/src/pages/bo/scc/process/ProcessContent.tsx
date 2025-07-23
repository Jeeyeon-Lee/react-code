import React, {useEffect, useState} from 'react';
import { useExcelStore } from '@pages/cmm/excel/excelStore.ts';
import CmmSearchForm from "@components/form/CmmSearchForm.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import {Card, Col, Form, Input, Row, Select, Tabs} from "antd";
import type {Chat} from "@pages/bo/scc/chat/chat.ts";
import {deleteChatMutation, useChatDetail, useChatList} from "@pages/bo/scc/chat/useChat.ts";
import {formSearch, modal} from '@utils/salmon.ts';
import CmmCodeSelect from "@components/form/CmmCodeSelect.tsx";
import type {ColumnsType} from "antd/es/table";
import ChatTable from "@pages/bo/scc/chat/ChatTable.tsx";
import ChatDetail from "@pages/bo/scc/chat/ChatDetail.tsx";
import CmmButton from "@components/form/CmmButton.tsx";
import {DeleteOutlined} from "@ant-design/icons";
import {useParams} from "react-router-dom";
import CmmExcelButton from "@components/form/CmmExcelButton.tsx";

const ProcessContent = () => {
    const [form] = Form.useForm();
    const {status} = useParams();
    const [searchParams, setSearchParams] = useState<Chat>({status:status} as Chat);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [columns, setColumns] = useState<ColumnsType>([]);
    const [selectedChatSeq, setSelectedChatSeq] = useState<string | null>(null);

    const { data: chatList = [] } = useChatList(searchParams);
    const { data: processDetail } = useChatDetail(selectedChatSeq ?? '');
    const { mutate: deleteChat } = deleteChatMutation();
    const chatStatusTabs = [
        { key: 'ALL', label: '전체' },
        { key: '진행중', label: '진행중' },
        { key: '완료', label: '완료' },
        { key: '이관', label: '이관' },
        { key: '보류', label: '보류' },
    ];
    const [activeTab, setActiveTab] = useState('ALL');

    const onTabChange = (key: string) => {
        setActiveTab(key);
        if (key === 'ALL') {
            setSearchParams({}); // 전체 조회
        } else {
            setSearchParams({ status: key } as Chat); // 상태 기반 조회
        }
    };

    useEffect(() => {
        if (status === 'ALL') {
            setSearchParams({} as Chat); // 전체 조회
        } else {
            setSearchParams(prev => ({
                ...prev,
                status,
            }));
        }
    }, [status]);

    useEffect(() => {
        useExcelStore.getState().setAllData(chatList);
        useExcelStore.getState().setSheetName(`${status}_상담`);
    }, [chatList]);

    useEffect(() => {
        useExcelStore.getState().setColumns(
            [
                { key: 'index', header: 'No' },
                ...columns
                    .filter(col => (col.dataIndex ?? col.key) !== 'index')
                    .map(col => ({
                        key: col?.dataIndex ?? col.key ?? '',
                        header: typeof col.title === 'string' ? col.title : '',
                    })),
            ]
        );
    }, [columns]);

    useEffect(() => {
        useExcelStore.getState().setSelectedData(selectedRows);
    }, [selectedRows]);

    /*검색하기*/
    const handleSubmitSearch = (fieldsValue : Chat) => {
        const values = formSearch<Chat>(fieldsValue);
        setSearchParams(values);
    };

    /*초기화*/
    const resetHandler = () => {
        setSelectedChatSeq('');
        setSelectedRows([]);
        setSelectedRowKeys([]);
    };

    /*테이블 로우 클릭*/
    const onRowClick = (record: Chat): React.HTMLAttributes<HTMLElement> => {
        return {
            onClick: () => {
                setSelectedChatSeq(record?.chatSeq);
            },
        };
    };

    /*삭제*/
    const handleDeleteChat = () => {
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
                    })
                );
            },
            centered: true,
        });
        return;
    };

    return (
        <>
            <CmmSearchForm
                form={form}
                onReset={resetHandler}
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
                        <CmmExcelButton
                            defaultColumns={['userNm', 'mgrNm', 'title', 'regDt', 'index']}
                            buttonText={"Excel Modal"}
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
                        {status === 'ALL' && (
                            <Tabs
                                activeKey={activeTab}
                                onChange={onTabChange}
                                items={chatStatusTabs?.map(tab => ({
                                    key: tab.key,
                                    label: tab.label,
                                }))}
                            />
                        )}
                        <ChatTable
                            chatList={chatList}
                            onRowClick={onRowClick}
                            onSelectRows={setSelectedRows}
                            selectedRowKeys={selectedRowKeys}
                            setSelectedRowKeys={setSelectedRowKeys}
                            setColumns={setColumns}
                            scrollY={260}
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
