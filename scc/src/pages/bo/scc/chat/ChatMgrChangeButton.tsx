import React, {useRef} from 'react';
import type {Mgr} from "@/types";
import CmmSelect from '@components/form/CmmSelect.tsx';
import type { CmmSelectRef } from '@components/form/CmmSelect.tsx';
import {Popover} from "antd";
import CmmButton from "@components/form/CmmButton.tsx";
import {FileTextOutlined} from "@ant-design/icons";
import {salmon} from "@utils/salmon.ts";
import { updateChatMgrMutation } from '@hooks/bo/scc/chat/useChat.ts';
import {useMgrList} from "@hooks/bo/base/mgr/useMgr.ts";

function ChatMgrChangeButton({chatSeq, disabled}) {
    const { data: mgrList } = useMgrList();
    const { mutate: updateChatMgr } = updateChatMgrMutation();
    const selectRef = useRef<CmmSelectRef>(null);

    const handleSelectChange = (mgrId:Mgr['mgrId']) => {
        handleUpdateChatMgr(mgrId!);
    };

    const handleUpdateChatMgr = (mgrId: Mgr['mgrId']) => {
        salmon.modal({
            type: 'confirm',
            title: '이관 확인',
            content: `다른 상담원에게 이관하시겠습니까?`,
            onOk: () => { updateChatMgr({chatSeq, mgrId}); },
            onCancel: () => {
                selectRef.current?.reset();
            },
            centered: true,
        });
    };

    const content = (
        <CmmSelect
            options={mgrList?.map(mgr => ({
                label: `${mgr.mgrNm}(${mgr.status})`,
                value: mgr.id,
                disabled: mgr.status === '휴가'
            }))}
            onChange={handleSelectChange}
        />
    );

    return (
        <Popover
            placement="topLeft"
            content={content}
            title="팀원변경"
            trigger="click"
        >
            <CmmButton
                icon={<FileTextOutlined />}
                disabled={disabled}
            >
                상담이관
            </CmmButton>
        </Popover>
    );
}

export default ChatMgrChangeButton;