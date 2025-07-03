import { useQuery } from '@tanstack/react-query';
import {chatKeys} from '@query/queryKeys.ts';
import axios from '@api/api.ts';
import type { Chat } from '@pages/cmm';


export const useChatHistory = (userId:Chat['userId']) => {
    return useQuery<Chat[] | undefined>({
        queryKey: chatKeys.history(userId).queryKey,
        queryFn: async () => {
            const response = await axios.get<Chat[]>(`/chat?userId=${userId}`);
            return response.data || [];
        },
        enabled: !!userId
    });
};
