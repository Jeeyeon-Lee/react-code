import { useQuery } from '@tanstack/react-query';
import { getUserDetail, getUsers } from '@api/bo/base/user/usersApi.ts';
import type { User } from '@pages/cmm';
import {userKeys} from '@query/queryKeys.ts';



export const useUserList = () => {
    return useQuery({
        queryKey: userKeys.list().queryKey,
        queryFn: () => getUsers(),
    });
};

export const useUserDetail = (userId:User['userId']) => {
    return useQuery({
        queryKey: userKeys.detail(userId).queryKey,
        queryFn: () => getUserDetail(userId),
        enabled: !!userId,
    });
};
