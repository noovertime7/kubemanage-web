import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from "@/router";


// 新建axios对象
const  httpClient = axios.create({
    VUE_APP_BASE_API: '/api',
    timeout: 10000,
    validateStatus(status) {
        return status >= 200 && status < 504
    }
})

httpClient.defaults.retry = 1
httpClient.defaults.retryDelay = 1000
httpClient.defaults.shoudRetry = true // 是否重试

// 请求拦截器
httpClient.interceptors.request.use(
    config => {
        // 添加header
        config.headers["Content-Type"] = 'application/json;charset=UTF-8'
        config.headers["Accept-Language"] = 'zh-CN'
        config.headers["token"] = localStorage.getItem("token")
        // 处理post请求
        if (config.method === 'POST') {
            if (!config.data) {
                config.data = []
            }
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)


// 响应拦截器
httpClient.interceptors.response.use(
    response => {
        if (response.status !== 200 || response.data.code !== 200 ) {
            if (response.data.code === 11002 ) {
                ElMessage({
                    message: '登录已过期，请重新登陆',
                    type: 'warning',
                })
                localStorage.removeItem('token')
                router.push('/login')
                return
            }
            return Promise.reject(response.data)
        }else {
            return response.data
        }
    },
    err => {
        return Promise.resolve(err)
    }
)


export default httpClient