import axios from "axios";
import { store } from "../stores/store";

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const aget = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

aget.interceptors.request.use(config => {
    store.uiStore.isBusy();
    return config;
});

aget.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
    finally {
        store.uiStore.isIdle();
    }
}, error => {
    store.uiStore.isIdle();
    return Promise.reject(error);
});

export default aget;