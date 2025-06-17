import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Select } from 'antd';

export interface CmmSelectRef {
    reset: () => void;
    focus: () => void;
}

interface CmmSelectProps {
    options: { label: string; value: string | number; disabled?: boolean }[];
    placeholder?: string;
    onChange?: (value: string) => void;
}

const CmmSelect = forwardRef<CmmSelectRef, CmmSelectProps>(
    ({ options, placeholder = '선택하세요', onChange }, ref) => {
        const [value, setValue] = useState<string>();
        const selectRef = useRef<any>(null);

        useImperativeHandle(ref, () => ({
            reset: () => {
                setValue(undefined);
                selectRef.current?.blur?.();
            },
            focus: () => {
                selectRef.current?.focus?.();
            }
        }));

        return (
            <Select
                ref={selectRef}
                style={{ width: 200 }}
                value={value}
                onChange={(val) => {
                    setValue(val);
                    onChange?.(val);
                }}
                placeholder={placeholder}
                options={options}
                allowClear
            />
        );
    }
);

export default CmmSelect;
