import {Button, Descriptions, Form, Input, message, Radio, Select, Space, Typography, Upload} from 'antd';

import {insertBbsMutation, updateBbsMutation, useBbsDetail} from "@pages/bo/base/bbs/core/useBbs.ts";
import type {Bbs} from "@pages/cmm";
import React, {useEffect} from "react";
import CmmButton from "@components/form/CmmButton.tsx";
import {InboxOutlined, UploadOutlined} from "@ant-design/icons";
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";

const { Option } = Select;
const {Text} = Typography;

const BbsForm = ({isExist, bbsSeq, bbsCd, setFormMode, setBbsSeq}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsDetail<Bbs>(bbsSeq||null);
    const {mutate: insertBbs} = insertBbsMutation();
    const {mutate: updateBbs} = updateBbsMutation();

    useEffect(() => {
        form.resetFields();
    }, [bbsSeq, bbsCd]);

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleSubmitContent = (values: any) => {
        if(!bbsCd) {
            message.warning('오류 발생');
            return;
        }

        // 수정
        if(isExist) {
            updateBbs(values)
        }
        // 등록
        else {
            insertBbs(values)
        }
    };

    const handleCancelBbs = async () => {
        // 수정이면 view, 등록이면 초기화면
        setFormMode('none');

        if(!isExist) {
            setBbsSeq(null);
        }
    }

    return (
        <CmmForm
            form={form}
            onFinish={handleSubmitContent}
            layout="vertical"
            style={{flex: 1, display: 'flex', flexDirection: 'column'}}
            requiredMark>
            <Form.Item
                name="id"
                hidden={true}
                initialValue={dataBean?.id||''}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="bbsCd"
                hidden={true}
                initialValue={bbsCd||''}
            >
                <Input/>
            </Form.Item>

            <Descriptions bordered column={4}>
                <Descriptions.Item span={4} label="제목">
                    <Form.Item
                        messageVariables={{label: '제목'}}
                        name="title"
                        initialValue={dataBean?.title||''}
                        rules={smValidateBuilder(
                            smRequired(),
                            smMax(20),
                        )}
                    >
                        <Input />
                    </Form.Item>
                </Descriptions.Item>

                <Descriptions.Item span={4} label="공지여부">

                    <Form.Item
                        name="ntcYn"
                        noStyle
                        initialValue={dataBean?.ntcYn || 'N'}
                        >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
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
                <Descriptions.Item span={4} label="파일등록">

                    <Form.Item
                        name="upload"
                        label="Upload"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload name="logo" action="/upload.do" listType="picture">
                            <Button icon={<UploadOutlined />}>Click to upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Dragger">
                        <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload.Dragger name="files" action="/upload.do">
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Form.Item>

                </Descriptions.Item>
            </Descriptions>

            <Space style={{alignSelf: 'flex-end'}}>

                <CmmButton
                    onClick={() => handleCancelBbs()}>
                    취소
                </CmmButton>

                <CmmButton
                    htmlType="submit"
                    type="primary"
                >
                    {isExist ? '수정' : '등록'}
                </CmmButton>
            </Space>


        </CmmForm>
    );
};

export default BbsForm;
