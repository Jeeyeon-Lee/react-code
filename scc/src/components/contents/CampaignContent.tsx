import React, { useState } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, Select, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { Campaign, CampaignUser } from '../../types/survey';
import { sampleCampaigns, sampleCampaignUsers } from '../../data/surveyData';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const CampaignContent: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
    const [campaignUsers, setCampaignUsers] = useState<CampaignUser[]>(sampleCampaignUsers);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUserModalVisible, setIsUserModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [userForm] = Form.useForm();
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

    const columns = [
        {
            title: '캠페인 ID',
            dataIndex: 'cmpn_ID',
            key: 'cmpn_ID',
        },
        {
            title: '캠페인명',
            dataIndex: 'cmpn_NM',
            key: 'cmpn_NM',
        },
        {
            title: '설명',
            dataIndex: 'cmpn_DESC',
            key: 'cmpn_DESC',
            ellipsis: true,
        },
        {
            title: '시작일',
            dataIndex: 'start_DD',
            key: 'start_DD',
        },
        {
            title: '종료일',
            dataIndex: 'end_DD',
            key: 'end_DD',
        },
        {
            title: '상태',
            dataIndex: 'run_CD',
            key: 'run_CD',
        },
        {
            title: '작업',
            key: 'action',
            render: (_: any, record: Campaign) => (
                <Space size="middle">
                    <Button 
                        icon={<UserOutlined />} 
                        onClick={() => handleUserManage(record)}
                    >
                        대상자
                    </Button>
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

    const userColumns = [
        {
            title: '고객 KEY',
            dataIndex: 'user_KEY',
            key: 'user_KEY',
        },
        {
            title: '고객명',
            dataIndex: 'user_NM',
            key: 'user_NM',
        },
        {
            title: '휴대폰',
            dataIndex: 'user_MOBILE',
            key: 'user_MOBILE',
        },
        {
            title: '상태',
            dataIndex: 'run_CD',
            key: 'run_CD',
        },
        {
            title: '시도횟수',
            dataIndex: 'try_CNT',
            key: 'try_CNT',
        },
    ];

    const handleAdd = () => {
        setEditingCampaign(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (campaign: Campaign) => {
        setEditingCampaign(campaign);
        form.setFieldsValue({
            ...campaign,
            dateRange: [dayjs(campaign.start_DD), dayjs(campaign.end_DD)]
        });
        setIsModalVisible(true);
    };

    const handleDelete = (campaign: Campaign) => {
        Modal.confirm({
            title: '캠페인 삭제',
            content: '정말로 이 캠페인을 삭제하시겠습니까?',
            onOk: () => {
                setCampaigns(campaigns.filter(c => c.cmpn_ID !== campaign.cmpn_ID));
                message.success('캠페인이 삭제되었습니다.');
            },
        });
    };

    const handleUserManage = (campaign: Campaign) => {
        setSelectedCampaign(campaign);
        setIsUserModalVisible(true);
    };

    const handleModalOk = () => {
        form.validateFields().then(values => {
            const { dateRange, ...rest } = values;
            const [start_DD, end_DD] = dateRange;

            if (editingCampaign) {
                // 수정
                setCampaigns(campaigns.map(c => 
                    c.cmpn_ID === editingCampaign.cmpn_ID ? 
                    { ...c, ...rest, start_DD: start_DD.format('YYYYMMDD'), end_DD: end_DD.format('YYYYMMDD') } : c
                ));
                message.success('캠페인이 수정되었습니다.');
            } else {
                // 추가
                const newCampaign: Campaign = {
                    ...rest,
                    cmpn_ID: `CMPN${String(campaigns.length + 1).padStart(3, '0')}`,
                    start_DD: start_DD.format('YYYYMMDD'),
                    end_DD: end_DD.format('YYYYMMDD'),
                    reg_ID: 'ADMIN',
                    reg_DT: new Date(),
                };
                setCampaigns([...campaigns, newCampaign]);
                message.success('캠페인이 추가되었습니다.');
            }
            setIsModalVisible(false);
        });
    };

    const handleUserModalOk = () => {
        userForm.validateFields().then(values => {
            const newUser: CampaignUser = {
                ...values,
                cmpn_ID: selectedCampaign!.cmpn_ID,
                try_CNT: 0,
                run_CD: 'READY',
                retry_YN: 'N',
                reg_ID: 'ADMIN',
                reg_DT: new Date(),
            };
            setCampaignUsers([...campaignUsers, newUser]);
            message.success('대상자가 추가되었습니다.');
            setIsUserModalVisible(false);
        });
    };

    return (
        <div>
            <Card
                title="캠페인 관리"
                extra={
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        캠페인 추가
                    </Button>
                }
            >
                <Table 
                    columns={columns} 
                    dataSource={campaigns}
                    rowKey="cmpn_ID"
                />
            </Card>

            <Modal
                title={editingCampaign ? '캠페인 수정' : '캠페인 추가'}
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
                        name="cmpn_NM"
                        label="캠페인명"
                        rules={[{ required: true, message: '캠페인명을 입력해주세요' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="cmpn_DESC"
                        label="설명"
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="dateRange"
                        label="기간"
                        rules={[{ required: true, message: '기간을 선택해주세요' }]}
                    >
                        <RangePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="type_CD"
                        label="유형"
                        rules={[{ required: true, message: '유형을 선택해주세요' }]}
                    >
                        <Select>
                            <Select.Option value="SURVEY">설문</Select.Option>
                            <Select.Option value="MARKETING">마케팅</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="create_CD"
                        label="생성방식"
                        rules={[{ required: true, message: '생성방식을 선택해주세요' }]}
                    >
                        <Select>
                            <Select.Option value="AUTO">자동</Select.Option>
                            <Select.Option value="MANUAL">수동</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="data_RCV_CD"
                        label="자료수신방식"
                        rules={[{ required: true, message: '자료수신방식을 선택해주세요' }]}
                    >
                        <Select>
                            <Select.Option value="WEB">웹</Select.Option>
                            <Select.Option value="API">API</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="대상자 관리"
                open={isUserModalVisible}
                onOk={handleUserModalOk}
                onCancel={() => setIsUserModalVisible(false)}
                width={1000}
            >
                <div style={{ marginBottom: 16 }}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />}
                        onClick={() => userForm.resetFields()}
                    >
                        대상자 추가
                    </Button>
                </div>

                <Table 
                    columns={userColumns} 
                    dataSource={campaignUsers.filter(u => u.cmpn_ID === selectedCampaign?.cmpn_ID)}
                    rowKey="user_KEY"
                />

                <Form
                    form={userForm}
                    layout="vertical"
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="user_KEY"
                        label="고객 KEY"
                        rules={[{ required: true, message: '고객 KEY를 입력해주세요' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="user_NM"
                        label="고객명"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="user_MOBILE"
                        label="휴대폰"
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CampaignContent; 