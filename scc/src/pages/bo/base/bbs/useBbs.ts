import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from "@api/api.ts";
import type {Bbs} from "@pages/bo/base/bbs/bbs.ts";
import type {Bbs, Bbs} from "@pages/cmm";
import {salmon} from "@utils/salmon.ts";
import {getLoginMgr} from "@api/cmm/loginApi.ts";
import {message} from "antd";

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

export const insertBbsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values:Bbs) => {
            if (!values.bbsCd) return;

            const newDate = salmon.date.newDate().format('YYYY-MM-DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                const newMenuId = salmon.date.newDate().format('YYYYMMDD_HHmmss');
                values.id = newMenuId.toString();
                values.bbsSeq = newMenuId.toString();
                values.regDt = newDate;
                values.regId = loginInfo?.mgrId;

                await axios.post<Bbs>(`/bbs`, values);

                //TODO orderNo 라스트 체크
            } catch (error) {
                console.error('등록 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsList'] });
            message.success(`등록되었습니다.`);
        },
        onError: async () => {
            message.error('실패했습니다.');
        },
    });
};

export const updateBbsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values:Bbs) => {
            if (!values.id) return;

            const newDate = salmon.date.newDate().format('YYYY-MM-DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                values.modiDt = newDate;
                values.modiId = loginInfo?.mgrId;

                await axios.patch<Bbs>(`/bbs/${values.id}`, values);

            } catch (error) {
                console.error('수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsList'] });
            message.success(`수정되었습니다.`);
        },
        onError: async () => {
            message.error('실패했습니다.');
        },
    });
};

export const deleteBbsMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: Bbs['id']) => {
            try {
                await axios.delete<Bbs>(`/bbs/${id}` );
            } catch (error) {
                console.error('삭제 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsList'] });
            message.success(`삭제되었습니다.`);
        },
        onError: async () => {
            message.error('삭제에 실패했습니다.');
        },
    });
};

// TODO: 나중에 검색 util로 변환 예정
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
