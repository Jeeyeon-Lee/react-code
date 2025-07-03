import React, {useState} from 'react';
import {Card, Col, Row, Select, Space, Table} from 'antd';
import type {ColumnsType} from "antd/es/table";
import type {Code} from "@pages/cmm";
import {useGroupCodeList} from "@pages/bo/base/code/useCode.ts";
import {EditFilled} from "@ant-design/icons";
import CmmButton from "@components/form/CmmButton.tsx";
import CodeForm from "@pages/bo/base/code/CodeForm.tsx";
import CodeDetailList from "@pages/bo/base/code/CodeDetailList.tsx";

const { Option } = Select;

function codeContent() {

    const {data: groupCodeList=[]} = useGroupCodeList();
    const [selectedGroupCd, setSelectedGroupCd] = useState<string>(null);
    const [selectedEditGroupCd, setSelectedEditGroupCd] = useState<string>(null);
    const [isOpenCodeForm, setOpenCodeForm] = useState<boolean>(false);

    const columns: ColumnsType<Code> = [
        { title: '', dataIndex: 'id', align: 'center' },
        { title: '그룹코드', dataIndex: 'groupCd', align: 'center' },
        { title: '그룹코드명', dataIndex: 'groupNm', sorter: (a, b) => a.groupNm.localeCompare(b.groupNm),align: 'center' },
        {
            title: '',
            render: (_, record) => (
                <Space size="middle">
                    <EditFilled onClick={(e) => editClick(e, record)}/>
                </Space>
            ),
        },
    ];

    const editClick = (e, record) => {
        e.preventDefault();
        e.stopPropagation();

        if(record.groupCd) {
            setOpenCodeForm(true);
            setSelectedEditGroupCd(record.groupCd);
        }
    }

    const onRowClick = (record: Code) => ({
        onClick: (e) => {
            e.preventDefault();

            setOpenCodeForm(false);
            setSelectedGroupCd(record.groupCd);
        }
    });

    const onAddGroupCode = () => {
        setOpenCodeForm(true);
        setSelectedGroupCd(null);
        setSelectedEditGroupCd(null);
    }

    return (
        <Row gutter={16}>
            <Col span={8}>
                <Card title="그룹코드 목록"  >
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={groupCodeList}
                        pagination={false}
                        onRow={onRowClick}
                    >
                    </Table>
                </Card>

                <CmmButton
                    type="primary"
                    onClick={() => onAddGroupCode()}
                >
                    그룹코드 추가

                </CmmButton>
            </Col>
            <Col span={16}>

                {isOpenCodeForm ? (
                    <CodeForm selectedEditGroupCd={selectedEditGroupCd} setSelectedEditGroupCd={setSelectedEditGroupCd}/>
                ) : (
                    <CodeDetailList selectedGroupCd={selectedGroupCd} />
                )}

            </Col>
        </Row>
    );
};

export default codeContent;