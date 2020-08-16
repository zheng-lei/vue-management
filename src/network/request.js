import axios from 'axios'
import router from '@/router'

const instance = axios.create({
    baseURL: "http://118.25.93.129:8083",
    timeout: 5000
});
//是否正在刷新
let isRefresh = false;
//存储请求的数组
let refreshSubscribers = [];
//存储请求的方法
function subscribeTokenRefresh(cb) {
    console.log(cb)
    refreshSubscribers.push(cb);
}
//新的token执行存储的请求
function onRefresh() {
    let token = window.sessionStorage.getItem("access_token");
    refreshSubscribers.map(cb => cb(token));
}
//刷新token的时间
function isRefreshTokenExpired() {
    let loginDate = window.sessionStorage.getItem('login_date');
    let nowDate = new Date().getTime();
    let stemp = parseInt(nowDate) - parseInt(loginDate);
    let minutes = parseInt((stemp % (1000 * 60 * 60)) / (1000 * 60));
    return minutes >= 14 ? true : false;
}
//添加请求拦截器
instance.interceptors.request.use(config => {
    //发送请求之前
    let token = window.sessionStorage.getItem("access_token");
    if(token) {
        config.headers.Authorization = 'Bearer ' + token;
        if(isRefreshTokenExpired() && (config.url.indexOf('/auth/refresh') === -1)) {
            if(!isRefresh) {
                isRefresh = true;
                axios({
                    method: 'post',
                    url: 'http://118.25.93.129:8083/api/v1/auth/refresh',
                    headers: {
                        Authorization: 'Bearer ' + window.sessionStorage.getItem('refresh_token')
                    }
                }).then(res => {
                    isRefresh = false;
                    window.sessionStorage.setItem("access_token",res.data.data.access_token);
                    window.sessionStorage.setItem("login_date",new Date().getTime());
                    config.headers.Authorization = 'Bearer ' + res.data.data.access_token;
                    onRefresh();
                    refreshSubscribers = [];
                }).catch(err => {
                    window.sessionStorage.removeItem('access_token');
                    window.sessionStorage.removeItem('refresh_token');
                    window.sessionStorage.removeItem("login_date");
                    router.replace({
                        path: '/login'
                    });
                });
                let retry = new Promise((resolve, reject) => {
                    subscribeTokenRefresh((token) => {
                        config.headers.Authorization = 'Bearer ' + token;
                        resolve(config);
                    })
                });
                return retry;
            }
        }
    }
    return config;
}, error => {
    //请求出错
    return Promise.reject(error);
});
//添加响应拦截器
instance.interceptors.response.use(response => {
    //响应数据
    return response;
}, error => {
    //请求出错
    if(error.response.status === 401) {
        window.sessionStorage.removeItem('access_token');
        window.sessionStorage.removeItem('refresh_token');
        window.sessionStorage.removeItem("login_date");
        router.replace({
            path: '/login'
        });
    }
    return Promise.reject(error.response.data);
});

export default instance