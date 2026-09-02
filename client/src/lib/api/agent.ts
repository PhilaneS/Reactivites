import axios from "axios";

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const aget = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

aget.interceptors.response.use(async response => {
    try {
        await sleep(1000);        
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
});

export default aget;