import React, { useEffect, useState } from 'react';
import { getCodeList } from '@api/codeApi';
import type { Code } from '@/types/code';

interface RadioProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    group: string;
}

const Radio = ({ group, ...props }: RadioProps) => {
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
        <select {...props}>
            <option value="">선택하세요</option>
            {options.map(item => (
                <option key={item.id} value={item.detailNm}>
                    {item.detailNm}
                </option>
            ))}
        </select>
    );
};

export default Radio;
