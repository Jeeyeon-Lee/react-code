import React from 'react';
import { Card, Form, Input, Button, Select, Switch, Space } from 'antd';

const { Option } = Select;

const SystemContent: React.FC = () => {
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        console.log('Received values:', values);
    };

    return (
        <Card title="시스템 설정">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="시스템 이름"
                    name="systemName"
                    rules={[{ required: true, message: '시스템 이름을 입력해주세요' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="시스템 언어"
                    name="language"
                    rules={[{ required: true, message: '언어를 선택해주세요' }]}
                >
                    <Select>
                        <Option value="ko">한국어</Option>
                        <Option value="en">English</Option>
                        <Option value="ja">日本語</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="시스템 테마"
                    name="theme"
                    rules={[{ required: true, message: '테마를 선택해주세요' }]}
                >
                    <Select>
                        <Option value="light">라이트</Option>
                        <Option value="dark">다크</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="알림 설정"
                    name="notifications"
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            저장
                        </Button>
                        <Button onClick={() => form.resetFields()}>
                            초기화
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SystemContent; 