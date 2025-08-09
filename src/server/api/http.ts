import axios from 'axios';

// 兼容Vue CLI和Vite的环境变量访问方式
export const getBaseURL = () => {
  // 尝试多种方式获取环境变量
  if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE_URL) {
    return process.env.VITE_API_BASE_URL;
  } else {
    // 默认值
    return 'http://localhost:1337/api';
  }
};

const instance = axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: false  // 修改为false，避免跨域请求时的凭证问题
  });

// 请求拦截器 - 添加调试信息和请求配置
instance.interceptors.request.use(
  config => {
    console.log(`发送 ${config.method?.toUpperCase()} 请求到:`, config.url)
    console.log('请求数据:', config.data)
    console.log('请求配置:', config)
    
    // 确保DELETE请求正确配置
    if (config.method?.toLowerCase() === 'delete') {
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

// 响应拦截器 - 保持完整响应对象并增强错误处理
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
    
    return response; // 返回完整的response对象，而不是只返回data
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

// 扩展http对象，添加增强的DELETE方法
const http = {
  ...instance,
  // 原始方法
  get: instance.get,
  post: instance.post,
  put: instance.put,
  patch: instance.patch,
  
  // 增强的DELETE方法，确保正确处理DELETE请求
  delete: (url: string, config?: any) => {
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
    return instance.delete(url, enhancedConfig);
  }
};

export default http;