import axios from '../lib/axios';
import type { CreateTemplateInput } from '../utils/validations/createTemplateSchema';

export const createTemplate = async (template: CreateTemplateInput) => {
    const res = await axios.post('/template', template)
    return res.data
}

export const fetchTemplates = async () => {
    const { data } = await axios.get('/templates')
    return data.templates
}

export const fetchTemplateById = async (templateId: string) => {
    const { data } = await axios.get(`/template/${templateId}`)
    return data.template
}

export const updateTemplate = async (templateId: string, template: CreateTemplateInput) => {
    const { data } = await axios.put(`/template/${templateId}`, template)
    return data.template
}