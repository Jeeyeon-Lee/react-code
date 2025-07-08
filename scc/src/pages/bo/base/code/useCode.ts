import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {Code} from '@pages/cmm';
import axios from "@api/api.ts";
import {salmon} from "@utils/salmon.ts";
import {getLoginMgr} from "@api/cmm/loginApi.ts";
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (values:Code) => {
            if (!values.groupCd) return;
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
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
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ groupId, values } : { id: Code['id'], values:Code}) => {
            if (!groupId) return;
            const newDate = salmon.date.newDate().format(('YYYY-MM-DD HH:mm:ss'));
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
    const queryClient = useQueryClient();
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

export const crudDetailCode = async ({
                                         insertList,
                                         updateList,
                                         deleteList,
                                     }: {
    insertList: Code[];
    updateList: Code[];
    deleteList: Code[];
}) => {
    const now = salmon.date.newDate().format("YYYY/MM/DD HH:mm:ss");
    const loginInfo = await getLoginMgr();

    const regInfo = {
        regId: loginInfo?.mgrId,
        regDt: now,
    };
    const modiInfo = {
        modiId: loginInfo?.mgrId,
        modiDt: now,
    };
    const requests: Promise<any>[] = []; // 모든 axios 요청을 담을 배열

    try {
        // 1. insert
        if (insertList.length > 0) {
            insertList.forEach((value) => {
                value.isNew = ''; // 'isNew' 속성 초기화
                requests.push(axios.post("/codeDetail", { ...value, ...regInfo }));
            });
        }

        // 2. update
        if (updateList.length > 0) {
            updateList.forEach((value) => {
                requests.push(axios.patch(`/codeDetail/${value.id}`, { ...value, ...modiInfo }));
            });
        }

        // 3. delete
        if (deleteList.length > 0) {
            deleteList.forEach((value) => {
                requests.push(axios.delete(`/codeDetail/${value.id}`));
            });
        }

        // 모든 요청이 완료될 때까지 기다림
        await Promise.all(requests);
        console.log('모든 변경사항 저장 완료');

    } catch (error) {
        console.error('변경사항 저장 실패:', error);
        throw error;
    }
};

export const useCrudDetailCode = () =>
    useMutation({
        mutationFn: crudDetailCode,

        onError: async () => {
            message.error('변경사항 저장에 실패했습니다.');
        },
    });

