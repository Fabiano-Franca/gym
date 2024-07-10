import { AppError } from "@utils/AppError";
import axios from "axios";

export const api = axios.create({
    baseURL: 'http://10.139.76.46:3333'
});

api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
    } else {
        return Promise.reject(new AppError('Erro no servidor. Tente novamente mais tarde.'));
    }
});