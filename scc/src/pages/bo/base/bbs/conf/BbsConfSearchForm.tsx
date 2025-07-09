import React, {useEffect} from 'react';
import {Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, theme} from 'antd';
import CmmForm from "@components/form/CmmForm.tsx";

const { Option } = Select;
const { RangePicker } = DatePicker;

const BbsConfSearchForm = ({ onSearch}) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    // init 세팅
    useEffect(() => {
        const defaultValues = form.getFieldsValue(); // 또는 초기값 직접 지정
        onSearch(defaultValues);
    }, []);

    const formStyle: React.CSSProperties = {
        maxWidth: 'none',
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        padding: 24,
    };

    const handleSubmitSearch = (fieldsValue: any) => {

        const rangeValue = fieldsValue['range-picker'];

        const values = {
            ...fieldsValue,
            sd: rangeValue && rangeValue[0].format('YYYY-MM-DD'),
            ed: rangeValue && rangeValue[1].format('YYYY-MM-DD'),
        };

        onSearch(values); // ✅ 상태 변경
    };
    const handleResetSearch = () => {
        form.resetFields();
        setTimeout(() => {
            const resetValues = form.getFieldsValue();
            onSearch(resetValues);
        }, 0);
    };

    return (
        <CmmForm
            form={form}
            name="searchForm"
            style={formStyle}
            onFinish={handleSubmitSearch}>

            <Row gutter={12}>
                <Col span={12} >
                    <Form.Item
                        name="range-picker"
                        label="기간 설정" >
                        <RangePicker />
                    </Form.Item>
                </Col>
                <Col span={4} >
                    <Form.Item
                        name='sk'
                        label='키워드'
                        initialValue="bbsNm"
                    >
                        <Select>
                            <Option value="bbsNm">게시판명</Option>
                            <Option value="bbsCd">게시판코드</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={4} >
                    <Form.Item
                        name='sv'
                    >
                        <Input></Input>
                    </Form.Item>
                </Col>
                <Col span={4} >
                    <Space size="small">
                        <Button type="primary" htmlType="submit">
                            검색
                        </Button>
                        <Button
                            onClick={handleResetSearch}
                        >
                            초기화
                        </Button>
                    </Space>
                </Col>
            </Row>
        </CmmForm>
    );
};

export default BbsConfSearchForm;