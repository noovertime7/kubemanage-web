import request from "@/utils/request";


export function getdeploymentlist(query) {
    return request({
        url: '/api/k8s/deployment/list',
        method: 'get',
        params: query
    })
}


export function getDeploymentByNs(query) {
    return request({
        url: '/api/k8s/deployment/numnp',
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

export function restartdeployment(query) {
    return request({
        url: '/api/k8s/deployment/restart',
        method: 'put',
        params: query
    })
}


export function createDeployment(data) {
    return request({
        url: '/api/k8s/deployment/create',
        method: 'post',
        data
    })
}



export function deleteDeployment(query) {
    return request({
        url: '/api/k8s/deployment/del',
        method: 'delete',
        params: query
    })
}