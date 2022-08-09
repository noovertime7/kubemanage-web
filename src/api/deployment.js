import request from "@/utils/request";


export function getNamespecelist(query) {
    return request({
        url: '/api/k8s/namespace/list',
        method: 'get',
        params: query
    })
}

export function getdeploymentlist(query) {
    return request({
        url: '/api/k8s/deployment/list',
        method: 'get',
        params: query
    })
}

export function getdeploymentdetail(query) {
    return request({
        url: '/api/k8s/deployment/detail',
        method: 'get',
        params: query
    })
}

export function updatedeployment(query) {
    return request({
        url: '/api/k8s/deployment/update',
        method: 'put',
        params: query
    })
}

export function scaledeployment(query) {
    return request({
        url: '/api/k8s/deployment/scale',
        method: 'get',
        params: query
    })
}