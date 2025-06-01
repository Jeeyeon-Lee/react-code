import {Button, Input} from 'antd';
import type {Chat} from '@/types';


//Type 받아서 interface로 정의한 뒤에 사용 : props로 넘겨받는 값이 객체 전체가 아닐 수도 있고, 일부일 수도 있어서 props 타입을 정확히 명시
interface CounselFormProps {
    chatSeq: Chat['chatSeq'];
}

const { TextArea } = Input;


const CounselForm = ({chatSeq}: CounselFormProps) => {
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