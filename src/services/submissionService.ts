import axios from '../lib/axios';
import type { CreateSubmission } from '../utils/types/submission';

export const createSubmission = async (submission_data: CreateSubmission) => {
    const formatted_data = {
        form_id: submission_data.form_id,
        user_id: submission_data.user_id,
        submission_data: JSON.stringify(submission_data.data)
    }
    const res = await axios.post('/submit', formatted_data)
    return res.data
}

export const fetchSubmissions = async () => {
    const { data } = await axios.get('/submissions')
    return data.submissions
}