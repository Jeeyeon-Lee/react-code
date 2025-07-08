import { useQuery } from '@tanstack/react-query';
// @ts-ignore
import axios from '@api/api.ts';
import type { Chat } from '@pages/cmm';
import {createQueryKeys} from "@lukemorales/query-key-factory";

const chatKeys = createQueryKeys('chat', {
    all: null,
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
