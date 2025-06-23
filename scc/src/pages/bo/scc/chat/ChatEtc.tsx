import { Card } from 'antd';
import { useEffect } from 'react';
import CmmRadioGroup from '@components/form/CmmRadioGroup.tsx';
import CmmRadio from '@components/form/CmmRadio.tsx';
import CmmTag from '@components/form/CmmTag.tsx';
import CmmButton from '@components/form/CmmButton.tsx';
import CmmCodeSelect from '@components/form/CmmCodeSelect.tsx';
import CmmCheckbox from '@components/form/CmmCheckbox.tsx';

const ChatEtc = () => {

    useEffect(() => {

    }, );

    return (
        <Card title="상담 기타" style={{ height: '100%', overflow: 'auto' }}>
            <CmmRadio label='라디오'>라디오</CmmRadio>
            <br/>
            <br/>
            <CmmRadioGroup
                options={[
                    { label: '선택 1', value: '1' },
                    { label: '선택 2', value: '2' },
                ]}
            />
            <br/>
            <br/>
            <CmmRadioGroup>
                <CmmRadio value="A">A 선택</CmmRadio>
                <CmmRadio value="B">B 선택</CmmRadio>
            </CmmRadioGroup>
            <br/>
            <br/>
            <CmmTag color="red">태그</CmmTag>
            <CmmTag color="blue">태그</CmmTag>
            <br/>
            <br/>
            <CmmButton
                tooltip="버튼"
            >
                버튼
            </CmmButton>
            <CmmButton children="버튼" danger block tooltip="버튼" />
            <br/>
            <br/>
            <CmmCodeSelect group="직원상태" mode='multiple'></CmmCodeSelect>
            <CmmCodeSelect group="상담상태" mode='tags'></CmmCodeSelect>
            <CmmCodeSelect group="상담유형"></CmmCodeSelect>
            <br/>
            <br/>
            <CmmCheckbox disabled>체크박스1</CmmCheckbox>
            <CmmCheckbox>체크박스2</CmmCheckbox>
        </Card>
    );
};

export default ChatEtc;