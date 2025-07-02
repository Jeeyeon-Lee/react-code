import {useQuery} from '@tanstack/react-query';
import axios from "@api/api.ts";
import type {Bbs} from "@/types/bo/base/bbs/bbs.ts";

export const useBbsList = (values:Bbs) => {
    return useQuery({
        queryKey: ['bbsList', values],
        queryFn: async () => {

            const params = buildQueryParams(values);
            const res = await axios.get<Bbs[]>('/bbs', { params });
            return res.data;
        },
    });
};

export const useBbsDetail = (bbsSeq:Bbs['bbsSeq']) => {
    return useQuery({
        queryKey: ['bbsSeq', bbsSeq],
        queryFn: async () => {

            const res = await axios.get<Bbs[]>(`/bbs?bbsSeq=${bbsSeq}`);
            return res.data[0];
        },
        enabled: !!bbsSeq
    });
};

// TODO: 나중에 검색 util로 빼digka
const buildQueryParams = (values: any) => {
    const params: Record<string, any> = {};

    Object.entries(values).forEach(([key, value]) => {
        if (key.startsWith('sk')) {
            const index = key.replace('sk', '');
            const valueKey = 'sv' + index;
            const actualKey = value; // 이게 실제 DB 컬럼명 (예: title, ctg)
            const actualValue = values[valueKey];

            if (actualKey && actualValue) {
                params[actualKey] = actualValue;
            }
        } else if (!key.startsWith('sv') && !key.startsWith('range-picker')) {
            // 그 외의 파라미터는 그대로
            params[key] = value;
        }
    });

    return params;
};
