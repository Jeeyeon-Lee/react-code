import { useQuery } from '@tanstack/react-query';
import { getUserDetail, getUsers } from '@api/usersApi';
import type { User } from '@/types';
import {userKeys} from '@query/queryKeys';


export const useUser = () => {

    const useUserList = () => {
        return useQuery({
            queryKey: userKeys.list().queryKey,
            queryFn: () => getUsers(),
        });
    };

    const useUserDetail = (userId:User['userId']) => {
        return useQuery({
            queryKey: userKeys.detail(userId).queryKey,
            queryFn: () => getUserDetail(userId),
            enabled: !!userId,
        });
    };
    return {
        useUserList,
        useUserDetail
    };
};
