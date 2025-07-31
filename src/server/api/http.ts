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

// 请求拦截器 - 添加调试信息
instance.interceptors.request.use(
  config => {
    console.log(`发送 ${config.method?.toUpperCase()} 请求到:`, config.url)
    console.log('请求数据:', config.data)
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 保持完整响应对象
instance.interceptors.response.use(
  response => {
    console.log('响应成功:', response.status, response.data)
    console.log('响应完整结构:', JSON.stringify(response))
    return response; // 返回完整的response对象，而不是只返回data
  },
  error => {
    console.error('响应失败:', error.response?.status, error.response?.data)
    console.error('错误完整信息:', error)
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/student/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;