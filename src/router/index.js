import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from "@/views/home/HomeView";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Layout from '../layout/Layout'

const routes = [
    {
        path: '/404',
        component: () => import('@/views/common/404.vue'),
        meta: {title:"404" ,requireAuth:false}
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '404'
    },
    {
        path: '/',
        redirect: '/home' //重定向
    },
    {
        path: '/login',  //url路径
        component: () => import('@/views/login/Login.vue'),  //视图组件
        icon: "odometer",  //图标
        meta: {title: "登录", requireAuth: false},  //meta元信息
    },
    {
        path: '/home',
        component: Layout,
        meta: {title:"概要" ,requireAuth:false},
        children: [
            {
                path: '/home',
                name: '概要',
                icon: 'Help',
                component: HomeView,
            }
        ]
    },
    {
        path: '/workflow',
        component: Layout,
        icon: "VideoPlay",
        children: [
            {
                path: "/workflow",
                name: "工作流",
                icon: "VideoPlay",
                meta: {title: "工作流", requireAuth: true},
                component: () => import('@/views/workflow/Workflow.vue')
            }
        ]
    },
    {
        path: '/workload',
        name: '工作负载',
        component:Layout,
        icon: 'menu',
        meta: {title:"工作负载" ,requireAuth:true},
        children: [
            {
                path: '/workload/deployment',
                name: 'Deployment',
                icon: 'el-icon-s-data',
                meta: {title:"Deployment" ,requireAuth:true},
                component: () => import('@/views/deployment/Deployment'),
            },
            {
                path: '/workload/pod',
                name: 'Pod',
                icon: 'el-icon-document-add',
                meta: {title:"Deployment" ,requireAuth:true},
                component: () => import('@/views/pod/Pod'),
            },
            {
                path: "/workload/deamonset",
                name: "DaemonSet",
                icon: "el-icon-document-add",
                meta: {title: "DaemonSet", requireAuth: true},
                component: () => import("@/views/daemonset/DaemonSet.vue")
            },
            {
                path: "/workload/statefulset",
                name: "StatefulSet",
                icon: "el-icon-document-add",
                meta: {title: "StatefulSets", requireAuth: true},
                component: () => import("@/views/statefulset/StatefulSet.vue")
            }
        ]
    },
    {
        path: "/loadbalance",
        name: "负载均衡",
        component: Layout,
        icon: "files",
        meta: {title: "负载均衡", requireAuth: true},
        children: [
            {
                path: "/loadbalance/service",
                name: "Service",
                icon: "el-icon-s-data",
                meta: {title: "Service", requireAuth: true},
                component: () => import("@/views/service/Service.vue")
            },
            {
                path: "/loadbalance/ingress",
                name: "Ingress",
                icon: "el-icon-document-add",
                meta: {title: "Ingress", requireAuth: true},
                component: () => import("@/views/ingress/Ingress.vue")
            }
        ]
    },
    {
        path: "/storage",
        name: "存储与配置",
        component: Layout,
        icon: "tickets",
        meta: {title: "存储与配置", requireAuth: true},
        children: [
            {
                path: "/storage/configmap",
                name: "Configmap",
                icon: "el-icon-document-add",
                meta: {title: "Configmap", requireAuth: true},
                component: () => import("@/views/configmap/ConfigMap.vue")
            },
            {
                path: "/storage/secret",
                name: "Secret",
                icon: "el-icon-document-add",
                meta: {title: "Secret", requireAuth: true},
                component: () => import("@/views/secret/Secret.vue")
            },
            {
                path: "/storage/persistentvolumeclaim",
                name: "PVC",
                icon: "el-icon-s-data",
                meta: {title: "PersistentVolumeClaim", requireAuth: true},
                component: () => import("@/views/persistentvolumeclaim/PersistentVolumeClaim.vue")
            }
        ]
    },
    {
        path: "/cluster",
        name: "集群",
        component: Layout,
        icon: "Cpu",
        meta: {title: "集群", requireAuth: true},
        children: [
            {
                path: "/cluster/node",
                name: "Node",
                icon: "el-icon-ship",
                meta: {title: "Node", requireAuth: true},
                component: () => import("@/views/node/Node.vue")
            },
            {
                path: "/cluster/namespace",
                name: "Namespace",
                icon: "el-icon-ship",
                meta: {title: "Namespace", requireAuth: true},
                component: () => import("@/views/namespace/Namespace.vue")
            },
            {
                path: "/cluster/persistentvolume",
                name: "PersistentVolume",
                icon: "el-icon-ship",
                meta: {title: "PersistemtVolume", requireAuth: true},
                component: () => import("@/views/persistentvolume/PersistentVolume.vue")
            }
        ]
    }
]


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
const router = createRouter({
    history: createWebHashHistory(),
    routes
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
const whiteList = ["/login", "/authredirect"];
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
        console.log(getToken())
        if (getToken()) {
            if (to.path === '/login') {
                next({path: '/home'})
            } else {
                next()
            }
        } else {
            console.log("没有token")
            if (whiteList.indexOf(to.path) !== -1) {
                next()
            } else {
                next('/login')
            }
        }
    }
)


const getToken = () => {
    return localStorage.getItem('token')
}


router.afterEach(() => {
    NProgress.done()
})


export default router
