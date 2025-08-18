import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
let isRefreshing = false;
let queue: { resolve: () => void; reject: (e: any) => void }[] = [];

function flushQueue(error: any = null) {
  queue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  queue = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original: any = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve: () => resolve(api(original)), reject });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await api.post('/auth/refresh');
        flushQueue();
        return api(original);
      } catch (e) {
        flushQueue(e);
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
