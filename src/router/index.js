import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from "@/views/home/HomeView";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const routes = [
    {
        path: '/home',
        name: 'HomeView',
        component: HomeView,
    },
    {
        path: '/404',
        component: () => import('@/views/common/404.vue'),
        meta: {title:"404" ,requireAuth:false}
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// 进度条配置
NProgress.inc(0.2)
//全局进度条的配置
NProgress.configure({
    easing: 'ease', // 动画方式
    speed: 1000, // 递增进度条的速度
    showSpinner: false, // 是否显示加载ico
    trickleSpeed: 200, // 自动递增间隔
    minimum: 0.3, // 更改启动时使用的最小百分比
    parent: 'body', //指定进度条的父容器
})

router.beforeEach((to,from,next) => {
    // 启动进度条
    NProgress.start()
    // 设置头部
    if (to.meta.title) {
        document.title = to.meta.title
    }else {
        document.title = "Kubernetes"
    }
    // 放行
    next()
})


router.afterEach(() => {
    NProgress.done()
})


export default router
