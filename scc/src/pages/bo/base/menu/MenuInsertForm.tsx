import React from 'react';
import {Form, Input, InputNumber, message, Space, Typography} from 'antd';
import {EditFilled} from '@ant-design/icons';
import CmmButton from '@components/form/CmmButton.tsx';
import {insertMenuMutation, useMenuDetail} from "@hooks/bo/base/menu/useMenu.ts";
import CmmRadioGroup from "@components/form/CmmRadioGroup.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smMin, smPattern, smRegex, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";

const {Text} = Typography;

const MenuInsertForm = ({selectedMenuCd, setSelectedMenuCd}) => {
    const [form] = Form.useForm();
    const isDisabled = !selectedMenuCd;
    const { data: menuDetailData, isLoading} = useMenuDetail(selectedMenuCd);
    const {mutate: insertMenu} = insertMenuMutation();

    const handleSubmitContent = async (values: any) => {
        if (!menuDetailData.id) {
            message.warning('메뉴가 선택되지 않았습니다.');
            return;
        }

        // option에 따라 highMenuCd 세팅
        const highMenuCd = getHighMenuCd(values.option);
        await insertMenu({ ...values, highMenuCd });

        form.resetFields();

    };

    // 메뉴 등록 시 상위 코드 체크
    const getHighMenuCd = (option) => {
        let highMenuCd = '';

        // 동일 레벨
        if( option === 'isSame' ) {
            highMenuCd = menuDetailData.highMenuCd;
        }
        else if ( option === 'isChild' ) {
            highMenuCd = selectedMenuCd;
        }
        else {
            highMenuCd = 'ROOT';
        }
        return highMenuCd;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding:'15px'}}>
            <div style={{flex: 1, overflow: 'auto'}}>
                <CmmForm
                    form={form}
                    layout="horizontal"
                    onFinish={handleSubmitContent}
                    style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                    requiredMark
                >
                    <Form.Item
                        label="메뉴 코드"
                        name="menuCd"
                        rules={smValidateBuilder(
                            smRequired(),
                            smMin(2),
                            smMax(20),
                            smPattern(smRegex.code.pattern, smRegex.code.message)
                        )}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="메뉴명"
                        name="label"
                        rules={smValidateBuilder(
                            smRequired(),
                            smMin(2),
                            smMax(20),
                        )}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="추가 옵션"
                        name="option"
                        initialValue="isRoot" // 초기 선택
                    >
                        <CmmRadioGroup
                            options={[
                                { label: '선택한 부서 동일 레벨에 추가', value: 'isSame' },
                                { label: '선택한 부서 하위 레벨에 추가', value: 'isChild' },
                                { label: '루트 부서에 추가', value: 'isRoot', checked: true },
                            ]}>
                        </CmmRadioGroup>
                    </Form.Item>

                    <Space style={{alignSelf: 'flex-end'}}>

                        <CmmButton
                            icon=<EditFilled/>
                            htmlType="submit"
                            type="primary"
                            disabled={isDisabled}
                        >
                            저장
                        </CmmButton>
                    </Space>
                </CmmForm>
            </div>
        </div>
    );

};

export default MenuInsertForm;
