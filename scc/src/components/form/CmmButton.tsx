import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import { forwardRef } from 'react';
import { checkButtonPermission } from '@utils/checkButtonPermission';
import type { ButtonType } from '@utils/checkButtonPermission';
import {useLogin} from "@hooks/cmm/login/useLogin.ts";
import {useMgrDetail} from "@hooks/bo/base/mgr/useMgr.ts";
import {useChatStore} from "@stores/bo/scc/chat/chatStore.ts";
import {useChatDetail} from "@hooks/bo/scc/chat/useChat.ts";

interface CmmButtonProps extends ButtonProps {
    tooltip?: string;
    buttonType?: ButtonType;
}
/*버튼별 상태처리 : checkButtonPermission.ts
*/
const CmmButton = forwardRef<HTMLButtonElement, CmmButtonProps>(
    ({ children, tooltip, style, buttonType, disabled, ...rest }, ref) => {
        const { chatSeq } = useChatStore();
        const { loginInfo } = useLogin();
        const { data: chatDetail } = useChatDetail(chatSeq);
        const { data: mgrDetail } = useMgrDetail(loginInfo?.mgrId);
        const chatStatus = chatDetail?.status;
        const mgrStatus = mgrDetail?.status;
        const isPermitted = buttonType
            ? checkButtonPermission(buttonType, mgrStatus, chatStatus)
            : true;

        const finalDisabled = disabled ?? !isPermitted;

        const button = (
            <Button
                ref={ref}
                disabled={finalDisabled}
                {...rest}
                style={{ ...style }}
            >
                {children}
            </Button>
        );

        return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
    }
);


CmmButton.displayName = 'CmmButton';
export default CmmButton;
