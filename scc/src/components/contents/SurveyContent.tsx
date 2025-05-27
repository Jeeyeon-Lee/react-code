import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, Switch, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Survey, SurveyQuestion, SurveyQuestionItem } from '../../types/survey';
import { sampleSurveys, sampleQuestions, sampleQuestionItems } from '../../data/surveyData';

const { TextArea } = Input;

const SurveyContent: React.FC = () => {
    const [surveys, setSurveys] = useState<Survey[]>(sampleSurveys);
    const [questions, setQuestions] = useState<SurveyQuestion[]>(sampleQuestions);
    const [questionItems, setQuestionItems] = useState<SurveyQuestionItem[]>(sampleQuestionItems);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingSurvey, setEditingSurvey] = useState<Survey | null>(null);

    const columns = [
        {
            title: '설문 ID',
            dataIndex: 'srvY_ID',
            key: 'srvY_ID',
        },
        {
            title: '분류',
            dataIndex: 'ctg_CD',
            key: 'ctg_CD',
        },
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '설명',
            dataIndex: 'srvY_DESC',
            key: 'srvY_DESC',
            ellipsis: true,
        },
        {
            title: '사용여부',
            dataIndex: 'use_YN',
            key: 'use_YN',
            render: (use_YN: string) => use_YN === 'Y' ? '사용' : '미사용',
        },
        {
            title: '작업',
            key: 'action',
            render: (_: any, record: Survey) => (
                <Space size="middle">
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    >
                        수정
                    </Button>
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger
                        onClick={() => handleDelete(record)}
                    >
                        삭제
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingSurvey(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (survey: Survey) => {
        setEditingSurvey(survey);
        form.setFieldsValue(survey);
        setIsModalVisible(true);
    };

    const handleDelete = (survey: Survey) => {
        Modal.confirm({
            title: '설문 삭제',
            content: '정말로 이 설문을 삭제하시겠습니까?',
            onOk: () => {
                setSurveys(surveys.filter(s => s.srvY_ID !== survey.srvY_ID));
                message.success('설문이 삭제되었습니다.');
            },
        });
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            if (editingSurvey) {
                // 수정
                setSurveys(surveys.map(s => 
                    s.srvY_ID === editingSurvey.srvY_ID ? { ...s, ...values } : s
                ));
                message.success('설문이 수정되었습니다.');
            } else {
                // 추가
                const newSurvey: Survey = {
                    ...values,
                    srvY_ID: `SRVY${String(surveys.length + 1).padStart(3, '0')}`,
                    reg_ID: 'ADMIN',
                    reg_DT: new Date(),
                };
                setSurveys([...surveys, newSurvey]);
                message.success('설문이 추가되었습니다.');
            }
            setIsModalVisible(false);
        });
    };

    return (
        <div>
            <Card
                title="설문 관리"
                extra={
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        설문 추가
                    </Button>
                }
            >
                <Table 
                    columns={columns} 
                    dataSource={surveys}
                    rowKey="srvY_ID"
                />
            </Card>

            <Modal
                title={editingSurvey ? '설문 수정' : '설문 추가'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="ctg_CD"
                        label="분류"
                        rules={[{ required: true, message: '분류를 선택해주세요' }]}
                    >
                        <Select>
                            <Select.Option value="CUSTOMER_SATISFACTION">고객 만족도</Select.Option>
                            <Select.Option value="PRODUCT_FEEDBACK">제품 피드백</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="srvY_DESC"
                        label="설명"
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="use_YN"
                        label="사용여부"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch 
                            checkedChildren="사용" 
                            unCheckedChildren="미사용"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SurveyContent; 