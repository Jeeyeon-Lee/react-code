import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { getCodeList } from '@api/codeApi';
import type { Code } from '@/types';

const { Option } = Select;

interface SelectBoxProps {
    group: string;
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const SelectBox = ({ group, value, onChange, placeholder = '선택하세요', disabled = false }: SelectBoxProps) => {
    const [options, setOptions] = useState<Code[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getCodeList();
                const filtered = res.data.filter(item => item.groupNm === group);
                setOptions(filtered);
            } catch (error) {
                console.error('코드 목록 불러오기 실패', error);
            }
        };
        fetchData();
    }, [group]);

    return (
        <Select
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{ width: '100%' }}
            allowClear
        >
            <Option value="all">전체</Option>
            {options.map(item => (
                <Option key={item.id} value={item.detailNm}>
                    {item.detailNm}
                </Option>
            ))}
        </Select>
    );
};

export default SelectBox;
