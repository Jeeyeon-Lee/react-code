import React, {useRef} from 'react';
import type {Mgr} from "@pages/cmm";
import CmmSelect from '@components/form/CmmSelect.tsx';
import type { CmmSelectRef } from '@components/form/CmmSelect.tsx';
import {Popover} from "antd";
import CmmButton from "@components/form/CmmButton.tsx";
import {FileTextOutlined} from "@ant-design/icons";
import {salmon} from "@utils/salmon.ts";
import { updateChatMgrMutation } from '@pages/bo/scc/chat/useChat.ts';
import {changeChatStatus, transferCall} from '@pages/cmm/cti/useCti.ts';
import {useMgrList} from "@pages/bo/base/mgr/useMgr.ts";

function ChatMgrChangeButton({chatSeq}) {
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
            onOk: async () => {
                await transferCall(mgrId, chatSeq);
                await updateChatMgr({chatSeq, mgrId});
            },
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
                buttonType='상담이관'
                icon={<FileTextOutlined />}
            >
                상담이관
            </CmmButton>
        </Popover>
    );
}

export default ChatMgrChangeButton;