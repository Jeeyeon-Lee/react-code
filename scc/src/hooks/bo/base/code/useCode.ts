import {useMutation, useQuery} from '@tanstack/react-query';
import type {Code} from '@/types';
import axios from "@api/api.ts";
import {salmon} from "@utils/salmon.ts";
import {getLoginMgr} from "@api/cmm/loginApi.ts";
import queryClient from "@query/queryClient.ts";
import {message} from "antd";

export const useGroupCodeList = () => {
    return useQuery({
        queryKey: ['groupCodeList'],
        queryFn: async () => {
            const response = await axios.get<Code[]>(`/codeGroup`);
            return response.data;
        }
    });
};

export const useGroupCodeDetail = (groupCd:Code['groupCd']) => {

    return useQuery({
        // queryKey: chatKeys.detail(chatSeq).queryKey,
        queryKey: ['groupCodeDetail', groupCd],
        queryFn: async () => {
            const response = await axios.get<Code[]>(`/codeGroup?groupCd=${groupCd}`);
            return response.data[0] || [];
        },
        enabled: !!groupCd
    });
};

export const useDetailCodeList = (groupCd:Code['groupCd']) => {

    return useQuery({
        queryKey: ['detailCodeList', groupCd],
        queryFn: async () => {
            const response = await axios.get<Code[]>(`/codeDetail?groupCd=${groupCd}`);
            return response.data;
        },
        enabled: !!groupCd
    });
};

export const insertGroupCodeMutation = () => {
    return useMutation({
        mutationFn: async (values:Code) => {
            if (!values.groupCd) return;
            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                const newMenuId = salmon.date.newDate().format('YYYYMMDD_HHmmss');
                values.id = newMenuId.toString();
                values.useYn = 'Y';
                values.regDt = newDate;
                values.regId = loginInfo?.mgrId;

                await axios.post<Code>(`/codeGroup`, values);

                //TODO orderNo 라스트 체크
            } catch (error) {
                console.error('그룹 코드 등록 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['groupCodeDetail'] });
            await queryClient.invalidateQueries({ queryKey: ['groupCodeList'] });
            message.success(`그룹 코드가 등록되었습니다.`);
        },
        onError: async () => {
            message.error('그룹 코드 등록에 실패했습니다.');
        },
    });
};

export const updateGroupCodeMutation = () => {

    return useMutation({
        mutationFn: async ({ groupId, values } : { id: Code['id'], values:Code}) => {
            if (!groupId) return;
            const newDate = salmon.date.newDate().format('YYYY/MM/DD HH:mm:ss');
            const loginInfo = await getLoginMgr();
            try {
                values.modiDt = newDate;
                values.modiId = loginInfo?.mgrId;

                await axios.patch<Code>(`/codeGroup/${groupId}`, values);
            } catch (error) {
                console.error('그룹 코드 수정 실패:', error);
                throw error;
            }
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['groupCodeDetail'] });
            await queryClient.invalidateQueries({ queryKey: ['groupCodeList'] });

            message.success(`그룹 코드가 수정되었습니다.`);
        },
        onError: () => {
            message.error('그룹 코드 수정에 실패했습니다.');
        }
    })
};

export const deleteGroupCodeMutation = () => {
    return useMutation({
        mutationFn: async (groupId: Code['id']) => {
            try {
                await axios.delete<Code>(`/codeGroup/${groupId}` );
            } catch (error) {
                console.error('그룹 코드 삭제 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['groupCodeDetail'] });
            await queryClient.invalidateQueries({ queryKey: ['groupCodeList'] });
            message.success(`그룹 코드가 삭제되었습니다.`);
        },
        onError: async () => {
            message.error('그룹 코드 삭제에 실패했습니다.');
        },
    });
};
