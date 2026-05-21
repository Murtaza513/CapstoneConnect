import axios from 'axios';
import useAuth from './context/useAuth'
import { BASE_URL } from './components/Utils/Config';


const server = BASE_URL;
const instance = axios.create({
    baseURL: server,
});

instance.interceptors.request.use((request) => {

    const token = localStorage.getItem('token')

    request.headers = {
        'Accept': "application/json, text/plain, */*",
        Authorization: `Bearer ${token}`,
    }
    return request
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response.status === 401) {
            console.log("axios Error Call -==") 
            localStorage.clear();
            window.location = "/";
        }
        return Promise.reject(error);
    }
);


export default instance;
