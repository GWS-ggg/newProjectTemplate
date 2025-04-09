import axios from 'axios'
// create an axios instance

const service = axios.create({
  // 海外测试 https://mprogram-test.forevernine.com/
  // 海外正式 https://mprogram.forevernine.com/
  baseURL: (import.meta as any).env.VITE_REQ_URL, // url = base url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 5, // 允许重定向
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // 如果是 POST 请求且有 params，将 params 转换为 data
    if (config.method === 'post' && config.params) {
      config.data = config.params
      delete config.params
    }
    console.log('Request Config:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    })
    console.log('config', config)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  },
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    console.log('Response:', response)
    const res = response.data
    // if the custom code is not 200, it is judged as an error.
    // TODO
    return res.data

    // if (res.ret !== 0) {
    //   return Promise.reject(new Error(res.msg || 'unknown error'))
    // }
    // else {
    //   return res.data
    // }
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config,
    })
    return Promise.reject(error)
  },
)
export default service
