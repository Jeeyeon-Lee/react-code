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
/*  icon은 icon/index.d.ts에 있는데... 걔네들도 선언할 때 그냥 icon="save"하면 매칭된 SaveFilled  이런식으로 못불러오나?
    <CmmButton type="primary" icon={<SaveFilled />} htmlType="submit" style={{ marginTop: 8, alignSelf: 'flex-end' }}>
        메모 저장
    </CmmButton>
*/
CmmButton.displayName = 'CmmButton';
export default CmmButton;
