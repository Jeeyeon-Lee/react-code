import React, {useState} from 'react';
import {Card} from 'antd';
import {useMgrList} from "@pages/bo/base/mgr/useMgr.ts";
import DsTable from "@pages/bo/scc/ds/DsTable.tsx";
import type {Chat} from "@pages/bo/scc/chat/chat.ts";

const DsContent = () => {
    const [selectedMgrId, setSelectedMgrId] = useState('');
    const {data : mgrList} = useMgrList();
    const onRowClick = (record: Chat) => ({
        onClick: () => {
            setSelectedMgrId(record.id);
        },
    });
    return (
        <Card title="상담 관리">
            <DsTable mgrList={mgrList} rowSelect={onRowClick} />
        </Card>
    );
};

export default DsContent;