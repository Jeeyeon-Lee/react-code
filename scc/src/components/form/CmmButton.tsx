import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import { forwardRef } from 'react';
import { checkButtonPermission } from '@utils/cti/checkButtonPermission.ts';
import type { ButtonType } from '@utils/cti/checkButtonPermission.ts';

interface CmmButtonProps extends ButtonProps {
    tooltip?: string;
    buttonType?: ButtonType;
}

const CmmButton = forwardRef<HTMLButtonElement, CmmButtonProps>(
    ({ children, tooltip, style, buttonType, disabled, ...rest }, ref) => {
        const isPermitted = buttonType
            ? checkButtonPermission(buttonType)
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

export default CmmButton;
