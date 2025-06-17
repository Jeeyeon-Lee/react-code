import { Radio } from 'antd';
import type { RadioGroupProps } from 'antd';
import { forwardRef } from 'react';

interface CmmRadioGroupProps extends RadioGroupProps {
    options?: { label: string; value: string | number }[];
}

const CmmRadioGroup = forwardRef<any, CmmRadioGroupProps>(
    ({ options, ...rest }, ref) => {
        return (
            <Radio.Group ref={ref} {...rest}>
                {options?.map(opt => (
                    <Radio key={opt.value} value={opt.value}>
                        {opt.label}
                    </Radio>
                ))}
                {!options && rest.children}
            </Radio.Group>
        );
    }
);

CmmRadioGroup.displayName = 'CmmRadioGroup';
export default CmmRadioGroup;
