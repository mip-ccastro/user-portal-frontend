import axios from '../lib/axios';
import type { CreateUserInput } from '../utils/validations/createUserSchema';
import type { UpdateUserInput } from '../utils/validations/updateUserSchema';

export const createUser = async (user: CreateUserInput) => {
    const res = await axios.post('/user', user)
    return res.data
}

export const updateUser = async (userId: string, user: UpdateUserInput) => {
    const res = await axios.put(`/user/${userId}`, user)
    return res.data
}

export const deleteUser = async (userId: string) => {
    const res = await axios.delete(`/user/${userId}`)
    return res.data
}

export const fetchUsers = async () => {
    const { data } = await axios.get('/users')
    return data.users
}

export const fetchUserById = async (userId: string) => {
    const { data } = await axios.get(`/user/${userId}`)
    return data.user
}