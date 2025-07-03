import axios from '@api/api';
import type {User} from '@pages/cmm';

//고객 관련 api(WIP)
export const getUsers = async() =>  {
    const response = await axios.get('/users');
    return response.data;
};
export const getUserDetail = async (userId:User['userId']) => {
    if (!userId) return;
    const response = await axios.get<User[]>(`/users?userId=${userId}`);
    return response.data[0];
};

