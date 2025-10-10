import axios from '../lib/axios';
import type { AddRecipientInput } from '../utils/validations/addRecipient';

export const addRecipient = async (recipient: AddRecipientInput) => {
    const res = await axios.post('/recipient', recipient)
    return res.data
}

export const fetchRecipients = async () => {
    const { data } = await axios.get('/recipients')
    return data.recipients
}

export const fetchRecipientById = async (recipientId: string) => {
    const { data } = await axios.get(`/recipient/${recipientId}`)
    return data.recipient
}

export const updateRecipient = async (recipientId: string, recipient: AddRecipientInput) => {
    const { data } = await axios.put(`/recipient/${recipientId}`, recipient)
    return data.recipient
}