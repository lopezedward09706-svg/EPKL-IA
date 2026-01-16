
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'https://esm.sh/axios@^1.7.9';
import { Layer, PaperStructure, Suggestion, SystemHealth } from '../types';

const API_BASE = 'http://localhost:5000/api';

class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private requestQueue: Map<string, Promise<any>> = new Map();

  private constructor() {
    this.api = axios.create({
      baseURL: API_BASE,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-EDPLIA-Version': '2.0.definitive'
      }
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('edplia_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('edplia_refresh_token');
            if (refreshToken) {
              const response = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
              const { token, refreshToken: newRefreshToken } = response.data;
              localStorage.setItem('edplia_token', token);
              localStorage.setItem('edplia_refresh_token', newRefreshToken);
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.api(originalRequest);
            }
          } catch {
            localStorage.removeItem('edplia_token');
            localStorage.removeItem('edplia_refresh_token');
          }
        }
        return Promise.reject(error);
      }
    );
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) ApiService.instance = new ApiService();
    return ApiService.instance;
  }

  async getLayers(): Promise<Layer[]> {
    return this.requestWithCache('GET', '/layers', null, 'layers');
  }

  async updateLayer(id: number, updates: Partial<Layer>): Promise<Layer> {
    return this.request('PUT', `/layers/${id}`, updates);
  }

  async generatePaper(layers: Layer[]): Promise<PaperStructure> {
    return this.request<PaperStructure>('POST', '/paper/generate', { layers });
  }

  async getSystemHealth(): Promise<SystemHealth> {
    return this.request<SystemHealth>('GET', '/system/health');
  }

  private async request<T>(method: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.request({ method, url, data, ...config });
      return response.data;
    } catch (error: any) {
      throw new Error(`[EDPLIA_API] ${error.response?.data?.message || error.message}`);
    }
  }

  private async requestWithCache<T>(method: string, url: string, data?: any, cacheKey?: string): Promise<T> {
    if (method !== 'GET' || !cacheKey) return this.request(method, url, data);
    const cached = localStorage.getItem(`cache_${cacheKey}`);
    const cacheTime = localStorage.getItem(`cache_${cacheKey}_time`);
    if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < 300000)) {
      return JSON.parse(cached);
    }
    const response = await this.request<T>(method, url, data);
    localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(response));
    localStorage.setItem(`cache_${cacheKey}_time`, Date.now().toString());
    return response;
  }

  async enqueueRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.requestQueue.has(key)) return this.requestQueue.get(key)!;
    const promise = requestFn().finally(() => this.requestQueue.delete(key));
    this.requestQueue.set(key, promise);
    return promise;
  }
}

export const apiService = ApiService.getInstance();
