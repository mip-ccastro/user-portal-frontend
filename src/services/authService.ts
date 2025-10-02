import axios from '../lib/axios';

export const login = async (username: string, password: string) => {
    const res = await axios.post('/signin', { username, password });
    return {
        status: res.status,
        data: res.data.user,
        access_token: res.headers['x-access-token'] ?? '',
        id_token: res.headers['x-id-token'] ?? '',
        refresh_token: res.headers['x-refresh-token'] ?? '',
    }
};

export const refreshToken = async (refreshToken: string) => {
  const res = await axios.post('token', { refresh_token: refreshToken });
  return res.data;
};
