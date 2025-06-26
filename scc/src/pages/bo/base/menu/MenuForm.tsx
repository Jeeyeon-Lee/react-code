import React, {useEffect} from 'react';
import {Col, Form, Input, InputNumber, message, Row, Space, Typography} from 'antd';
import {DeleteTwoTone, EditFilled} from '@ant-design/icons';
import CmmButton from '@components/form/CmmButton.tsx';
import {deleteMenuMutation, updateMenuMutation, useMenuDetail} from "@hooks/bo/base/menu/useMenu.ts";
import CmmRadioGroup from "@components/form/CmmRadioGroup.tsx";
import CmmForm from "@components/form/CmmForm.tsx";
import {smMax, smMin, smRequired, smValidateBuilder} from "@utils/form/smValidateBuilder.ts";
import type {MenuType} from "@/types";

const {Text} = Typography;

const MenuForm = ({selectedMenuCd, setSelectedMenuCd, selectedMenuPath}) => {
    const [form] = Form.useForm();
    const isDisabled = !selectedMenuCd;
    const { data: menuDetailData, isLoading} = useMenuDetail(selectedMenuCd);
    const {mutate: updateMenu} = updateMenuMutation();
    const {mutate: deleteMenu} = deleteMenuMutation();

    useEffect(() => {
        if (!menuDetailData) return;

        form.resetFields();
        form.setFieldsValue({
            path: menuDetailData.path,
            orderNo: menuDetailData.orderNo,
            label: menuDetailData.label,
            useYn: menuDetailData.useYn,
            menuNo: menuDetailData.menuNo,
        });
    }, [menuDetailData]);

    const handleSubmitContent = (values: any) => {
        if (!menuDetailData.id) {
            message.warning('메뉴가 선택되지 않았습니다.');
            return;
        }

        let menuId = menuDetailData.id;
        updateMenu({menuId, values });
    };

    const handleDeleteMenu = async () => {
        if (!menuDetailData.id)  return;
        await deleteMenu(menuDetailData.id);

        setSelectedMenuCd('');
    }

    function getBreadcrumbItems (menuList: MenuType[], menuCd: string) {
        const items: String[{}] = [];

        let current = menuList.find(m => m.path === locationPath);

        while (current) {
            items.unshift({title: current.label}); // 앞에 추가해서 루트부터 순서대로
            if (current.highMenuCd === 'ROOT') break;
            current = menuList.find(m => m.menuCd === current.highMenuCd);
        }

        return items;
    };

    if (isLoading) {
        return <div>메뉴 상세 정보를 불러오는 중...</div>;
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', padding:'15px'}}>
            <CmmForm
                form={form}
                layout="horizontal"
                onFinish={handleSubmitContent}
                style={{flex: 1, display: 'flex', flexDirection: 'column'}}
                requiredMark
            >
                <Form.Item label="메뉴 경로" >
                    <Text>{selectedMenuPath||'-'}</Text>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="메뉴 코드">
                            <Text>{menuDetailData?.menuCd||'-'}</Text>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="정렬 순서"
                            name="orderNo"
                        >
                            <InputNumber min={1}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="메뉴 번호"
                            name="menuNo"
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="메뉴 URL"
                    name="path"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="사용 여부"
                    name="useYn"
                >
                    <CmmRadioGroup
                        options={[
                            { label: '사용', value: 'Y' },
                            { label: '미사용', value: 'N' },
                        ]}>
                    </CmmRadioGroup>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="등록일"
                        >
                            <Text>{menuDetailData?.regDt||'-'} ({menuDetailData?.regNm||''})</Text>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="최종 수정일"
                        >
                            <Text>{menuDetailData?.modiDt||'-'} ({menuDetailData?.modiNm||''})</Text>
                        </Form.Item>
                    </Col>
                </Row>

                <Space style={{alignSelf: 'flex-end'}}>

                    <CmmButton
                        icon={<DeleteTwoTone /> }
                        onClick={() => handleDeleteMenu()}
                        type="primary"
                        danger
                        disabled={isDisabled}>
                        삭제
                    </CmmButton>

                    <CmmButton
                        icon=<EditFilled/>
                        htmlType="submit"
                        type="primary"
                        disabled={isDisabled}
                    >
                        수정
                    </CmmButton>
                </Space>
            </CmmForm>
        </div>
    );

};

export default MenuForm;
