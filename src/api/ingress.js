import request from "@/utils/request";

export function GetIngress(query) {
    return request({
        url: '/api/k8s/ingress/list',
        method: 'get',
        params: query
    })
}


export function GetIngressDetail(query) {
    return request({
        url: '/api/k8s/ingress/detail',
        method: 'get',
        params: query
    })
}


export function UpdateIngress(query) {
    return request({
        url: '/api/k8s/ingress/update',
        method: 'put',
        params: query
    })
}

export function DeleteIngress(query) {
    return request({
        url: '/api/k8s/ingress/del',
        method: 'delete',
        params: query
    })
}


export function CreateIngress(data) {
    return request({
        url: '/api/k8s/ingress/create',
        method: 'post',
        data
    })
}

