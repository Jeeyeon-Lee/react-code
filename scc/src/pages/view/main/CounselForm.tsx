import {
    Button,
    Input,
} from 'antd';

const { TextArea } = Input;


function CounselForm() {
    return (
        <div style={{ height: '50vh', display: 'flex', flexDirection: 'column', background: '#fff', padding: '16px' }}>
            <div style={{ marginBottom: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4>상담내역 작성</h4>
                <TextArea
                    rows={4}
                    placeholder="상담내역을 입력하세요"
                    style={{ flex: 1 }}
                />
                <Button type="primary" style={{ marginTop: '8px', alignSelf: 'flex-end' }}>저장</Button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4>메모</h4>
                <TextArea
                    rows={4}
                    placeholder="메모를 입력하세요"
                    style={{ flex: 1 }}
                />
                <Button style={{ marginTop: '8px', alignSelf: 'flex-end' }}>메모 저장</Button>
            </div>

        </div>
    );
};

export default CounselForm;