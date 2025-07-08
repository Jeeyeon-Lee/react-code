import React from 'react';
import {
    CoffeeOutlined,
    SmileOutlined,
    ClockCircleOutlined,
    UserDeleteOutlined,
    DesktopOutlined,
    TeamOutlined,
    PhoneOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { useLogin } from '@pages/cmm/login/useLogin.ts';
import { Divider } from 'antd';


function CounselStatus({ none }: string) {

    const { loginInfo } = useLogin();
    const status = loginInfo ? loginInfo.status : undefined;

    const noneList = (none || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    if (noneList.includes(status)) return null;

    const statusMap = {
        '대기': {
            icon: <SmileOutlined style={{ fontSize: '40px', color: '#bfbfbf' }} />,
            label: '대기중',
            description: '상담 준비가 완료되지 않았습니다.',
        },
        '식사': {
            icon: <CoffeeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '식사중',
            description: '잠시 후 다시 상담 가능합니다.',
        },
        '교육': {
            icon: <TeamOutlined style={{ fontSize: '40px', color: '#13c2c2' }} />,
            label: '교육중',
            description: '지금은 교육 시간입니다.',
        },
        '후처리': {
            icon: <ClockCircleOutlined style={{ fontSize: '40px', color: '#f5222d' }} />,
            label: '후처리중',
            description: '상담 후 조치사항을 처리 중입니다.',
        },
        '미팅': {
            icon: <TeamOutlined style={{ fontSize: '40px', color: '#722ed1' }} />,
            label: '미팅중',
            description: '회의 중으로 상담이 어렵습니다.',
        },
        '휴식': {
            icon: <CoffeeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '휴식중',
            description: '충전 후 다시 상담해주세요.',
        },
        '상담불가': {
            icon: <UserDeleteOutlined style={{ fontSize: '40px', color: '#ff4d4f' }} />,
            label: '상담 불가 상태',
            description: '현재 상담이 불가능합니다.',
        },
        '작업': {
            icon: <DesktopOutlined style={{ fontSize: '40px', color: '#1890ff' }} />,
            label: '작업중',
            description: '다른 업무를 수행 중입니다.',
        },
        '티타임': {
            icon: <CoffeeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '티타임',
            description: '잠시 티타임을 갖고 있습니다.',
        },
        '모니터링': {
            icon: <DesktopOutlined style={{ fontSize: '40px', color: '#2f54eb' }} />,
            label: '모니터링',
            description: '상담을 관찰 또는 평가 중입니다.',
        },
        'OB작업': {
            icon: <PhoneOutlined style={{ fontSize: '40px', color: '#fa541c' }} />,
            label: 'OB 작업 중',
            description: '아웃바운드 전화를 진행 중입니다.',
        },
        '기타': {
            icon: <QuestionCircleOutlined style={{ fontSize: '40px', color: '#d9d9d9' }} />,
            label: '기타 상태',
            description: '정의되지 않은 기타 업무 중입니다.',
        },
    };

    const { icon, label, description } = statusMap[status] || {};
    if (!statusMap[status]) return null;

    return (
        <>
            <Divider />
            <div style={{ textAlign: 'center', margin: '10px' }}>
                {icon}
                <div style={{ fontSize: '14px', fontWeight: 500, marginTop: 8 }}>
                    {label}
                </div>
                <div style={{ fontSize: '12px', color: '#aaa', marginTop: 4 }}>
                    {description}
                </div>
            </div>
            <Divider />
        </>
    );
}

export default CounselStatus;
