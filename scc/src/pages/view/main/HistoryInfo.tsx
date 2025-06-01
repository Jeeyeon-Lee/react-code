import { Card } from 'antd';
import { useEffect } from 'react';
import type { Chat } from '@/types';

const HistoryInfo = ({ chatSeq }: { chatSeq: Chat['chatSeq'] }) => {

    useEffect(() => {

    }, [chatSeq]);

    return (
        <Card title="상담 내역" style={{ height: '100%', overflow: 'auto' }}></Card>
    );
};

export default HistoryInfo; 