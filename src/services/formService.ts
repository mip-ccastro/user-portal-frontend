/* eslint-disable @typescript-eslint/ban-ts-comment */

import axios from '../lib/axios';
import type { CreateFormInput } from '../utils/validations/createForm';
import type { UpdateFormInput } from '../utils/validations/updateForm';

export const addForm = async (form: CreateFormInput) => {
    const res = await axios.post('/form', form)
    return res.data
}

export const fetchForms = async () => {
    const { data } = await axios.get('/forms')
    return data.forms
}

export const fetchFormById = async (formId: string) => {
    const { data } = await axios.get(`/form/${formId}`)
    return data.form
}

export const updateForm = async (formId: string, form: UpdateFormInput) => {
    //@ts-ignore
    form.form_fields = JSON.stringify(form.form_fields)
    const { data } = await axios.put(`/form/${formId}`, form)
    return data.form
}