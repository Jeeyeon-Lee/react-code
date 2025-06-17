import { Radio } from 'antd';
import type { RadioProps } from 'antd';
import { forwardRef } from 'react';

interface CmmRadioProps extends RadioProps {
    label?: string;
}

const CmmRadio = forwardRef<any, CmmRadioProps>(
    ({ label, children, ...rest }, ref) => (
        <Radio
            ref={ref}
            {...rest}
        >
            {label || children}
        </Radio>
    )
);

CmmRadio.displayName = 'CmmRadio';
export default CmmRadio;
