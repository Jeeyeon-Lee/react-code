import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import axios from "@api/api.ts";
import type {BbsConf} from "@pages/cmm";
import {salmon} from "@utils/salmon.ts";
import {getLoginMgr} from "@api/cmm/loginApi.ts";
import {message} from "antd";

export const useBbsConfList = (values:BbsConf) => {
    return useQuery({
        queryKey: ['bbsConfList', values],
        queryFn: async () => {

            console.log(values);

            const params = buildQueryParams(values);

            const res = await axios.get<BbsConf[]>('/bbsConf', { params });
            return res.data;
        },
    });
};

export const useBbsConfDetail = (bbsCd:BbsConf['bbsCd']) => {
    return useQuery({
        queryKey: ['bbsCd', bbsCd],
        queryFn: async () => {

            const res = await axios.get<BbsConf[]>(`/bbsConf?bbsCd=${bbsCd}`);
            return res.data[0];
        },
        enabled: !!bbsCd
    });
};

export const insertBbsConfMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values:BbsConf) => {

            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                const newMenuId = salmon.date.newDate().format('YYYYMMDD_HHmmss');
                values.id = newMenuId.toString();
                values.bbsCd = newMenuId.toString();
                values.regDt = newDate;
                values.regId = loginInfo?.mgrId;

                await axios.post<BbsConf>(`/bbsConf`, values);

                //TODO orderNo 라스트 체크
            } catch (error) {
                console.error('등록 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsConfList'] });
            message.success(`등록되었습니다.`);
        },
        onError: async () => {
            message.error('실패했습니다.');
        },
    });
};

export const updateBbsConfMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values:BbsConf) => {
            if (!values.id) return;

            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                values.modiDt = newDate;
                values.modiId = loginInfo?.mgrId;

                await axios.patch<BbsConf>(`/bbsConf/${values.id}`, values);

            } catch (error) {
                console.error('수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsConfList'] });
            message.success(`수정되었습니다.`);
        },
        onError: async () => {
            message.error('실패했습니다.');
        },
    });
};

export const deleteBbsConfMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: BbsConf['id']) => {
            try {
                await axios.delete<BbsConf>(`/bbsConf/${id}` );
            } catch (error) {
                console.error('삭제 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['bbsConfList'] });
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
