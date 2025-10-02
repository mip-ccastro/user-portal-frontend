import { getIdToken } from "../services/tokenService"
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

export const logout = async () => {
  const idToken = getIdToken();

  const res = await axios.delete('/signout', {
    headers: {
      "x-id-token": idToken
    }
  });

  return res.data
}