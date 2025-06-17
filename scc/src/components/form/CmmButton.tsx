import { Button, Tooltip } from 'antd';
import type { ButtonProps } from 'antd';
import { forwardRef } from 'react';

interface CmmButtonProps extends ButtonProps {
    tooltip?: string;
}

const CmmButton = forwardRef<HTMLButtonElement, CmmButtonProps>(
    ({ children, tooltip, style, ...rest }, ref) => {
        const button = (
            <Button
                ref={ref}
                {...rest}
                style={{
                    ...style,
                }}
            >
                {children}
            </Button>
        );

        return tooltip ? <Tooltip title={tooltip}>{button}</Tooltip> : button;
    }
);

CmmButton.displayName = 'CmmButton';
export default CmmButton;
