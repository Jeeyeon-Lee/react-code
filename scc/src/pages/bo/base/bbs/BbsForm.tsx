import {Checkbox, Descriptions, Form, Input, Select, Typography} from 'antd';

import {useBbsDetail} from "@hooks/bo/base/bbs/useBbs.ts";
import type {Bbs} from "@/types";
import React, {useEffect} from "react";

const { Option } = Select;
const {Text} = Typography;

const BbsForm = ({isExist, bbsSeq}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsDetail<Bbs>(bbsSeq||null);

    useEffect(() => {
        form.resetFields();
    }, [bbsSeq]);

    const handleUpdateBbs = async () => {

        alert('수정');
    }

    const handleDeleteBbs = async () => {

        alert('삭제');
    }

    return (

        <Form form={form} layout="vertical">
            <Descriptions bordered column={4}>
                <Descriptions.Item span={4} label="제목">
                    <Form.Item
                        name="title"
                        noStyle
                        initialValue={dataBean?.title||''}
                    >
                        <Input />
                    </Form.Item>
                </Descriptions.Item>

                <Descriptions.Item span={4} label="공지여부">
                    <Form.Item
                        name="ntcYn"
                        noStyle
                    >
                        <Checkbox checked={dataBean?.ntcYn === 'Y' ? true : false} />
                    </Form.Item>
                </Descriptions.Item>

                <Descriptions.Item span={4} label="내용">
                    <Form.Item
                        name="question"
                        noStyle
                        initialValue={dataBean?.question||''}
                    >
                        <Input.TextArea />
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item span={2} label="분류">
                    <Form.Item
                        name="ctgCd"
                        noStyle
                        initialValue={dataBean?.ctgCd||''}
                    >
                        <Select>
                            <Option value="">--선택--</Option>
                            <Option value="ctg1">분류1</Option>
                            <Option value="ctg2">분류2</Option>
                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item span={2} label="분류1">
                    <Form.Item
                        name="ctgCd1"
                        noStyle
                        initialValue={dataBean?.ctgCd1||''}
                    >
                        <Select>
                            <Option value="">--선택--</Option>
                            <Option value="ctg1">분류1</Option>
                            <Option value="ctg2">분류2</Option>
                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item span={2} label="분류2">
                    <Form.Item
                        name="ctgCd2"
                        noStyle
                        initialValue={dataBean?.ctgCd2||''}
                    >
                        <Select>
                            <Option value="">--선택--</Option>
                            <Option value="ctg1">분류1</Option>
                            <Option value="ctg2">분류2</Option>
                        </Select>
                    </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item span={2} label="분류3">
                    <Form.Item
                        name="ctgCd3"
                        noStyle
                        initialValue={dataBean?.ctgCd3||''}
                    >
                        <Select>
                            <Option value="">--선택--</Option>
                            <Option value="ctg1">분류1</Option>
                            <Option value="ctg2">분류2</Option>
                        </Select>
                    </Form.Item>
                </Descriptions.Item>
            </Descriptions>
        </Form>
    );
};

export default BbsForm;
