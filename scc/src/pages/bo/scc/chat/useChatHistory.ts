import { useQuery } from '@tanstack/react-query';
import axios from '@api/api.ts';
import type { Chat } from '@pages/cmm';
import {createQueryKeys} from "@lukemorales/query-key-factory";

const chatKeys = createQueryKeys('chat', {
    all: null, //null이지만 'chat'으로 들어가짐
    history: (userId: Chat['userId']) => ['history', userId]
});
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
