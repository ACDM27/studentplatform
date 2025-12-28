import axios from 'axios';

// 兼容Vue CLI和Vite的环境变量访问方式
// 根域名（无 /api 前缀），用于调用非 Strapi /api 的路由，例如 /ocr/process
export const getServerURL = () => {
  // 优先读取新的变量名 VITE_API_URL，其次兼容旧变量 VITE_API_BASE_URL
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
    return process.env.VITE_API_URL;
  } else if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    // 兼容旧变量，如果包含 /api 则去掉
    const url = import.meta.env.VITE_API_BASE_URL as string
    return url.endsWith('/api') ? url.replace(/\/api$/, '') : url
  } else if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    const url = process.env.VITE_API_BASE_URL as string
    return url.endsWith('/api') ? url.replace(/\/api$/, '') : url
  } else {
    return 'http://localhost:1337';
  }
}

// Strapi API 基础地址（带 /api 前缀），用于现有多数接口
export const getBaseURL = () => {
  const root = getServerURL()
  return root.endsWith('/') ? `${root}api` : `${root}/api`
}

const instance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false  
});

// 请求拦截器 - 添加调试信息和请求配置
instance.interceptors.request.use(
  config => {
    console.log(`发送 ${config.method?.toUpperCase()} 请求到:`, config.url)
    console.log('请求数据:', config.data)
    console.log('请求配置:', config)
    
    // 检查是否是FormData请求
    if (config.data instanceof FormData) {
      console.log('检测到FormData请求，移除Content-Type让浏览器自动设置')
      // 对于FormData，删除Content-Type让浏览器自动设置正确的boundary
      delete config.headers['Content-Type']
    } else if (config.method?.toLowerCase() === 'delete') {
      console.log('检测到DELETE请求，确保正确配置')
      // 确保DELETE请求有正确的Content-Type
      config.headers = config.headers || {}
      config.headers['Content-Type'] = 'application/json'
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一返回 data，保持数据结构一致
instance.interceptors.response.use(
  response => {
    console.log('响应成功:', response.status, response.data)
    console.log('响应完整结构:', JSON.stringify(response))
    
    // 特殊处理DELETE请求的响应
    if (response.config && response.config.method?.toLowerCase() === 'delete') {
      console.log('DELETE请求响应处理:', response.status)
      // 对于DELETE请求，204状态码是常见的成功响应
      if (response.status === 204) {
        console.log('DELETE请求成功(204 No Content) - 这是正常的响应')
        // 为204响应添加空数据对象，确保一致性
        response.data = response.data || {};
      }
    }
    
    // 对于登录接口，直接返回完整的 response.data
    // 因为 Strapi 的登录接口返回的是 { jwt: "...", user: {...} }
    if (response.config.url?.includes('/auth/local')) {
      console.log('登录接口响应，返回完整数据:', response.data)
      return response.data;
    }
    
    // 统一返回 data，避免多层嵌套
    return response.data;
  },
  error => {
    console.error('响应失败:', error.response?.status, error.response?.data)
    console.error('错误完整信息:', error)
    
    // 检查是否是网络错误
    if (!error.response) {
      console.error('网络错误或服务器未响应')
      return Promise.reject({
        ...error,
        message: '网络错误或服务器未响应，请检查网络连接或服务器状态'
      });
    }
    
    // 处理不同的错误状态码
    if (error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/student/login';
      }
    } else if (error.response.status === 404) {
      console.error('请求的资源不存在(404)')
    } else if (error.response.status >= 500) {
      console.error('服务器内部错误:', error.response.status)
    }
    
    return Promise.reject(error);
  }
);

// 创建类型安全的 HTTP 客户端
// 由于响应拦截器返回 response.data，我们需要正确的类型定义
interface HttpClient {
  get<T = any>(url: string, config?: any): Promise<T>
  post<T = any>(url: string, data?: any, config?: any): Promise<T>
  put<T = any>(url: string, data?: any, config?: any): Promise<T>
  patch<T = any>(url: string, data?: any, config?: any): Promise<T>
  delete<T = any>(url: string, config?: any): Promise<T>
  defaults: {
    baseURL?: string
    timeout?: number
    headers?: any
  }
}

// 扩展http对象，添加增强的DELETE方法和正确的类型
const http: HttpClient = {
  get: <T = any>(url: string, config?: any): Promise<T> => {
    return instance.get(url, config) as Promise<T>
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return instance.post(url, data, config) as Promise<T>
  },
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return instance.put(url, data, config) as Promise<T>
  },
  patch: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return instance.patch(url, data, config) as Promise<T>
  },
  // 增强的DELETE方法，确保正确处理DELETE请求
  delete: <T = any>(url: string, config?: any): Promise<T> => {
    console.log(`增强的DELETE方法调用: ${url}`);
    // 确保配置对象存在
    const enhancedConfig = config || {};
    
    // 确保headers存在
    enhancedConfig.headers = enhancedConfig.headers || {};
    
    // 设置正确的Content-Type
    enhancedConfig.headers['Content-Type'] = 'application/json';
    
    // 添加调试信息
    console.log('增强的DELETE请求配置:', enhancedConfig);
    
    // 调用原始的delete方法
    return instance.delete(url, enhancedConfig) as Promise<T>
  },
  // 暴露 defaults 以便访问配置
  defaults: instance.defaults
};

// 基于根域的 Axios 实例（无 /api 前缀），用于 /ocr/* 等路由
const rootInstance = axios.create({
  baseURL: getServerURL(),
  timeout: 10000,
  withCredentials: false
});

// 共享相同的拦截器逻辑
rootInstance.interceptors.request.use(
  config => {
    console.log(`[ROOT] 发送 ${config.method?.toUpperCase()} 请求到:`, config.url)
    if (config.data instanceof FormData) {
      delete config.headers?.['Content-Type']
    }
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config
  },
  error => Promise.reject(error)
)

rootInstance.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
)

export const httpRoot: HttpClient = {
  get: <T = any>(url: string, config?: any): Promise<T> => {
    return rootInstance.get(url, config) as Promise<T>
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return rootInstance.post(url, data, config) as Promise<T>
  },
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return rootInstance.put(url, data, config) as Promise<T>
  },
  patch: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return rootInstance.patch(url, data, config) as Promise<T>
  },
  delete: <T = any>(url: string, config?: any): Promise<T> => {
    return rootInstance.delete(url, config) as Promise<T>
  },
  defaults: rootInstance.defaults
}

// 将相对路径转为绝对地址
export const toAbsoluteUrl = (url: string): string => {
  try {
    return new URL(url, getServerURL()).href
  } catch {
    return url
  }
}

export default http;