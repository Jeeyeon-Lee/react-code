import { useEffect, useState, forwardRef } from 'react';
import { Select } from 'antd';
import type { Code } from '@/types';
import type { SelectProps } from 'antd';
import {getCodeList} from '@api/bo/base/code/codeApi';

const { Option } = Select;

interface CmmCodeSelectProps extends SelectProps<string> {
    group?: string;
    vale?: string;
}

const CmmCodeSelect = forwardRef<any, CmmCodeSelectProps>(
    ({ group, value, onChange, placeholder = '선택하세요', ...rest }, ref) => {
        const [options, setOptions] = useState<Code[]>([]);

        useEffect(() => {
            if (!group) return;

            const fetchData = async () => {
                try {
                    const res = await getCodeList(group);
                    const filtered = res.filter(item => item.group === group);
                    setOptions(filtered);
                } catch (error) {
                    console.error('코드 목록 불러오기 실패', error);
                }
            };

            fetchData();
        }, [group]);

        return (
            <Select
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                allowClear
                style={{ width: '100%' }}
                {...rest}
            >
                <Option value="all">전체</Option>
                {options.map(item => (
                    <Option key={item.id} value={item.detail}>
                        {item.detail}
                    </Option>
                ))}
            </Select>
        );
    }
);

export default CmmCodeSelect;
