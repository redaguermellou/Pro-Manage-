import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const auth = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

export const projects = {
    create: (user_uid, name, description) => api.post('/projects/create', { user_uid, name, description }),
    list: (user_uid) => api.get(`/projects/list?user_uid=${user_uid}`),
};

export const tasks = {
    create: (project_uid, title, description, priority, assignee_uid) => api.post('/tasks/create', { project_uid, title, description, priority, assignee_uid }),
    list: (project_uid) => api.get(`/tasks/list?project_uid=${project_uid}`),
    updateStatus: (task_uid, status) => api.post('/tasks/update', { task_uid, status }),
};

export default api;
