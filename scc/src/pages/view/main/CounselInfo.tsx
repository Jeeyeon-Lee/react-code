import { Card, Descriptions } from 'antd';

function CounselInfo() {

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Card
                title="기본 상담 정보"
                size="small"
                style={{ flex: 1, overflowY: 'auto' }}
            >
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="상담사">홍길동</Descriptions.Item>
                    <Descriptions.Item label="상담 ID">1234564</Descriptions.Item>
                    <Descriptions.Item label="사업자번호">3332-1545-1234</Descriptions.Item>
                    <Descriptions.Item label="전화번호">010-1456-1234</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card
                title="이관 정보"
                size="small"
                style={{ flex: 1, overflowY: 'auto' }}
            >
                <Descriptions column={1} size="small">
                    <Descriptions.Item label="이관 날짜">2024-05-23</Descriptions.Item>
                    <Descriptions.Item label="이관 사유">시스템 오류</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card
                title="팀원 변경 내역"
                size="small"
                style={{ flex: 1, overflowY: 'auto' }} // 남은 공간을 채우고 스크롤 가능하게
            >
                <div>
                    <p>홍길동 → 이순신 (2024-05-22 오후 6:06)</p>
                    <p>이순신 → 홍길동 (2024-05-22 오후 6:08)</p>
                </div>
            </Card>
        </div>
    );
};

export default CounselInfo;
