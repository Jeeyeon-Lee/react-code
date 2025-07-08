import {forwardRef, useEffect, useState} from 'react';
import type {SelectProps} from 'antd';
import {Select} from 'antd';
import type {Code} from '@pages/cmm';
import axios from "@api/api.ts";

const { Option } = Select;

interface CmmCodeSelectProps extends SelectProps<string> {
    group?: string;
    all?:boolean;
    vale?: string;
}

const getCodeList = async (group:Code['group']) => {
    const response = await axios.get<Code[]>(
        `/codeDetail?groupCd=${group}`
    );
    return response.data;
};


const CmmCodeSelect = forwardRef<any, CmmCodeSelectProps>(
    ({ group, all=true, value, onChange, placeholder = '선택하세요', ...rest }, ref) => {
        const [options, setOptions] = useState<Code[]>([]);

        useEffect(() => {
            if (!group) return;

            const fetchData = async () => {
                try {
                    const res = await getCodeList(group);
                    const filtered = res.filter(item => item.groupCd === group);
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
                {all && (
                    <Option value="all">전체</Option>
                )}
                {options?.map(item => (
                    <Option key={item.id} value={item.detailNm}>
                        {item.detailNm}
                    </Option>
                ))}
            </Select>
        );
    }
);

export default CmmCodeSelect;
