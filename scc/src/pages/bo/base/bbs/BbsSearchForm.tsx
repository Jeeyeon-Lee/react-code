import React, {useEffect, useState} from 'react';
import {Button, Col, DatePicker, Form, Input, Row, Select, Space, theme} from 'antd';
import CmmForm from "@components/form/CmmForm.tsx";

const { Option } = Select;
const { RangePicker } = DatePicker;

const BbsSearchForm = ({bbsCd, onSearch}) => {
    const { token } = theme.useToken();
    const [form] = Form.useForm();

    // bbsCd 변경 --> 게시판 메뉴 변경 상황
    useEffect(() => {
        if (bbsCd) {
            form.resetFields();
            form.setFieldsValue({ bbsCd });
        }
    }, [bbsCd]);

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

        const values = {
            bbsCd: bbsCd
        };

        form.resetFields();
        onSearch(values); // ✅ 상태 변경
    };

    return (
        <CmmForm
            form={form}
            name="searchForm"
            style={formStyle}
            onFinish={handleSubmitSearch}>
            <Form.Item
                name="sk02"
                hidden={true}
                initialValue="ctgCd"
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="bbsCd"
                hidden={true}
                initialValue={bbsCd}
            >
                <Input/>
            </Form.Item>

            <Row gutter={12}>
                <Col span={12} >
                    <Form.Item
                        name="range-picker"
                        label="기간설정" >
                        <RangePicker />
                    </Form.Item>
                </Col>
                <Col span={12} >
                    <Form.Item
                        name="sv02"
                        label="게시판 분류" >
                        <Select
                            placeholder={'--분류--'}>
                            <Option value="">--분류--</Option>
                            <Option value="ctg1">분류1</Option>
                            <Option value="ctg2">분류2</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={4} >
                    <Form.Item
                        name='sk'
                        label='키워드'
                        initialValue="title"
                    >
                        <Select>
                            <Option value="title">제목</Option>
                            <Option value="question">내용</Option>
                            <Option value="regNm">작성자</Option>
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

export default BbsSearchForm;