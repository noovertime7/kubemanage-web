import request from "@/utils/request";


export function getPodList(query) {
    return request({
        url: '/api/k8s/pod/list',
        method: 'get',
        params: query
    })
}


export function GetPodContainer(query) {
    return request({
        url: '/api/k8s/pod/container',
        method: 'get',
        params: query
    })
}


export function GetPodLog(query) {
    return request({
        url: '/api/k8s/pod/log',
        method: 'get',
        params: query
    })
}




export function GetPodDetail(query) {
    return request({
        url: '/api/k8s/pod/detail',
        method: 'get',
        params: query
    })
}


export function GetPodByNS(query) {
    return request({
        url: '/api/k8s/pod/numnp',
        method: 'get',
        params: query
    })
}


export function UpdatePod(query) {
    return request({
        url: '/api/k8s/pod/update',
        method: 'put',
        params: query
    })
}


export function DeletePod(query) {
    return request({
        url: '/api/k8s/pod/del',
        method: 'delete',
        params: query
    })
}
