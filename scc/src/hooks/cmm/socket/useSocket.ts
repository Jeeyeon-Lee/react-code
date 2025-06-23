import { useQuery, useMutation } from '@tanstack/react-query';
import queryClient from '@query/queryClient.ts';
import axios from '@api/api';
import { message } from 'antd';


export const useSocketDetail = () => {
    return useQuery({
        queryKey: ['socket'],
        queryFn: async () => {
            const response = await axios.get(`/socket`);
            return response.data;
        },
    });
};

export const updateSocketStatusMutation = () => {
    return useMutation({
        mutationFn: async (status) => {
            try {
                const response = await axios.patch(`/socket/1`, {status});
                return response.data;
            } catch (error) {
                message.error('소켓 업데이트 실패:', error);
                throw error;
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['socket'] });
            message.success('소켓 상태가 변경되었습니다.');
        },
    });
};