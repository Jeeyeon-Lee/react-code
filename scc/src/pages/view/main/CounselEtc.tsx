import { Card } from 'antd';
import { useEffect } from 'react';
import type { Chat } from '@/types';

const CounselEtc = ({ chatSeq }: { chatSeq: Chat['chatSeq'] }) => {

    useEffect(() => {

    }, [chatSeq]);

    return (
        <Card title="상담 기타" style={{ height: '100%', overflow: 'auto' }}></Card>
    );
};

export default CounselEtc;