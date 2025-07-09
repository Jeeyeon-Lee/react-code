import {Descriptions, Form, Input, Radio, Select, Space, Typography} from 'antd';
import type {BbsConf} from "@pages/cmm";
import React, {useEffect} from "react";
import CmmButton from "@components/form/CmmButton.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";
import {insertBbsConfMutation, updateBbsConfMutation, useBbsConfDetail} from "@pages/bo/base/bbs/conf/useBbsConf.ts";

const { Option } = Select;
const {Text} = Typography;

const BbsConfForm = ({isExist, bbsCd, setFormMode}) => {
    const [form] = Form.useForm();
    const {data: dataBean} = useBbsConfDetail<BbsConf>(bbsCd||null);
    const {mutate: insertBbsConf} = insertBbsConfMutation();
    const {mutate: updateBbsConf} = updateBbsConfMutation();

    useEffect(() => {
        form.resetFields();
    }, [bbsCd]);

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleSubmitContent = (values: any) => {
        // 수정
        if(isExist) {
            updateBbsConf(values)
        }
        // 등록
        else {
            insertBbsConf(values)
        }
    };

    const handleCancelBbsConf = async () => {
        // 수정이면 view, 등록이면 초기화면
        setFormMode('none');
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
                <Descriptions.Item span={2} label="게시판명">
                    <Form.Item
                        messageVariables={{label: '게시판명'}}
                        name="bbsNm"
                        initialValue={dataBean?.bbsNm||''}
                        rules={smValidateBuilder(
                            smRequired(),
                            smMax(20),
                        )}
                    >
                        <Input />
                    </Form.Item>
                </Descriptions.Item>

                <Descriptions.Item span={2} label="게시판 코드">
                    자동할당
                </Descriptions.Item>

                <Descriptions.Item span={2} label="게시판 유형">
                    <Form.Item
                        name="typeCd"
                        noStyle
                        initialValue={dataBean?.typeCd||''}
                    >
                        <Select>
                            <Option value="">--선택--</Option>
                            <Option value="typeCd1">일반형</Option>
                            <Option value="typeCd2">계층형</Option>
                        </Select>
                    </Form.Item>
                </Descriptions.Item>

                <Descriptions.Item span={2} label="분류 여부">

                    <Form.Item
                        name="ctgYn"
                        noStyle
                        initialValue={dataBean?.ctgYn || 'N'}
                        >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Descriptions.Item>

                <Descriptions.Item span={2} label="관리전용 여부">

                    <Form.Item
                        name="admYn"
                        noStyle
                        initialValue={dataBean?.admYn || 'N'}
                        >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Descriptions.Item>

                <Descriptions.Item span={2} label="의견글 여부">

                    <Form.Item
                        name="cmtYn"
                        noStyle
                        initialValue={dataBean?.cmtYn || 'N'}
                        >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Descriptions.Item>
                <Descriptions.Item span={2} label="공지 여부">

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
                <Descriptions.Item span={2} label="첨부파일 여부">

                    <Form.Item
                        name="fileYn"
                        noStyle
                        initialValue={dataBean?.fileYn || 'N'}
                        >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Descriptions.Item>
                <Descriptions.Item span={2} label="첨부파일 수">

                    <Form.Item
                        name="fileCnt"
                        noStyle
                        initialValue={dataBean?.fileCnt || ''}
                        >
                        <Input/>
                    </Form.Item>

                </Descriptions.Item>
                <Descriptions.Item span={2} label="HTML 여부">

                    <Form.Item
                        name="htmlYn"
                        noStyle
                        initialValue={dataBean?.htmlYn || 'N'}
                    >
                        <Radio.Group>
                            <Radio value="Y">사용</Radio>
                            <Radio value="N">미사용</Radio>
                        </Radio.Group>
                    </Form.Item>

                </Descriptions.Item>


            </Descriptions>

            <Space style={{alignSelf: 'flex-end'}}>

                <CmmButton
                    onClick={() => handleCancelBbsConf()}>
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

export default BbsConfForm;
