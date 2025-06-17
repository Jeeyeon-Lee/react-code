import { Checkbox } from 'antd';
import type { CheckboxProps, CheckboxRef } from 'antd';
import { forwardRef } from 'react';

interface CmmCheckboxProps extends CheckboxProps {
    label?: string;
}

const CmmCheckbox = forwardRef<CheckboxRef, CmmCheckboxProps>(
    ({ label, children, ...rest }, ref) => {
        return (
            <Checkbox ref={ref} {...rest}>
                {label || children}
            </Checkbox>
        );
    }
);

CmmCheckbox.displayName = 'CmmCheckbox';
export default CmmCheckbox;
