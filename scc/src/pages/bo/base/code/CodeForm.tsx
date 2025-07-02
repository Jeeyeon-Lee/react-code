import React, {useEffect} from 'react';
import {Card, Col, Form, Input, Row, Space, Typography} from 'antd';
import {DeleteTwoTone, EditFilled} from '@ant-design/icons';
import CmmButton from '@components/form/CmmButton.tsx';
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smMin, smPattern, smRegex, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";
import {
    deleteGroupCodeMutation,
    insertGroupCodeMutation,
    updateGroupCodeMutation,
    useGroupCodeDetail
} from "@hooks/bo/base/code/useCode.ts";

const {Text} = Typography;

const CodeForm = ({selectedEditGroupCd, setSelectedEditGroupCd}) => {
    const [form] = Form.useForm();
    const isExist:boolean = selectedEditGroupCd;
    const { data: groupCodeDetailData} = useGroupCodeDetail(selectedEditGroupCd||'');
    const {mutate: insertGroupCode} = insertGroupCodeMutation();
    const {mutate: updateGroupCode} = updateGroupCodeMutation();
    const {mutate: deleteGroupCode} = deleteGroupCodeMutation();

    useEffect(() => {
        form.resetFields();
        if (!isExist) return;

        form.setFieldsValue({
            groupCd: groupCodeDetailData?.groupCd,
            groupNm: groupCodeDetailData?.groupNm,
        });
    }, [groupCodeDetailData, isExist]);

    const handleSubmitContent = async (values: any) => {

        // 등록, 수정
        if(!isExist) {
            await insertGroupCode(values);
        }
        else {
            let groupId = groupCodeDetailData.id;
            await updateGroupCode({groupId, values})
        }

        setSelectedEditGroupCd(values.groupCd);
    };

    const handleDeleteCode = async () => {
        if (!groupCodeDetailData.id)  return;
        await deleteGroupCode(groupCodeDetailData.id);

        setSelectedEditGroupCd('');
    }
    return (
        <Card title={!isExist ? '그룹코드 등록' : '그룹코드 수정'}>
            <CmmForm
                form={form}
                layout="horizontal"
                onFinish={handleSubmitContent}
                style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                requiredMark
            >
                <Form.Item
                    label="그룹 코드"
                    name="groupCd"
                    rules={smValidateBuilder(
                        smRequired(),
                        smMin(2),
                        smMax(20),
                        smPattern(smRegex.code.pattern, smRegex.code.message)
                    )}
                >
                    <Input disabled={isExist} />
                </Form.Item>
                <Form.Item
                    label="그룹코드명"
                    name="groupNm"
                    rules={smValidateBuilder(
                        smRequired(),
                        smMin(2),
                        smMax(20),
                    )}
                >
                    <Input />
                </Form.Item>

                {isExist &&
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="등록일"
                            >
                                <Text>{groupCodeDetailData?.regDt||'-'} ({groupCodeDetailData?.regNm||''})</Text>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="최종 수정일"
                            >
                                <Text>{groupCodeDetailData?.modiDt||'-'} ({groupCodeDetailData?.modiNm||''})</Text>
                            </Form.Item>
                        </Col>
                    </Row>}

                <Space style={{alignSelf: 'flex-end'}}>
                    {isExist && (<CmmButton
                        icon={<DeleteTwoTone /> }
                        onClick={() => handleDeleteCode()}
                        type="primary"
                        danger>
                        삭제
                    </CmmButton>) }

                    <CmmButton
                        icon=<EditFilled/>
                        htmlType="submit"
                        type="primary"
                    >
                        {!isExist ? '등록' : '수정'}
                    </CmmButton>
                </Space>
            </CmmForm>
        </Card>
    );

};

export default CodeForm;
