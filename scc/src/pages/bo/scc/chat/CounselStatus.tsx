import React from 'react';
import {
    CoffeeOutlined,
    SmileOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { useLogin } from '@hooks/cmm/login/useLogin.ts';
import { useMgrDetail } from '@hooks/bo/base/mgr/useMgr.ts';
import {Divider} from "antd";

function CounselStatus() {
    const { loginInfo } = useLogin();
    const { data: mgrDetail } = useMgrDetail(loginInfo?.mgrId);

    const status = mgrDetail?.status;

    const statusMap = {
        '상담준비': {
            icon: <SmileOutlined style={{ fontSize: '40px', color: '#1890ff' }} />,
            label: '상담 준비 중입니다.',
            description: '상담가능으로 상태를 변경하시면 상담을 시작할 수 있습니다.',
        },
/*        '상담가능': {
            icon: <CustomerServiceOutlined style={{ fontSize: '40px', color: '#52c41a' }} />,
            label: '상담 가능 상태입니다.',
            description: '인바운드 상담을 받을 수 있습니다.',
        },*/
        '이석-식사': {
            icon: <CoffeeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '식사 중입니다.',
            description: '잠시 후 다시 상담 가능합니다.',
        },
        '휴식': {
            icon: <CoffeeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '휴식 중입니다.',
            description: '충전 후 다시 상담해주세요.',
        },
        '휴가': {
            icon: <CloseCircleOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />,
            label: '휴가 중입니다.',
            description: '현재 상담이 불가능합니다.',
        },
        '후처리': {
            icon: <ClockCircleOutlined style={{ fontSize: '40px', color: '#f5222d' }} />,
            label: '후처리 중입니다.',
            description: '상담 후 조치사항을 처리 중입니다.',
        },
    };

    const { icon, label, description } = statusMap[status] || '';

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
