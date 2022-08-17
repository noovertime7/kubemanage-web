import request from "@/utils/request";

export function GetConfigMap(query) {
    return request({
        url: '/api/k8s/configmap/list',
        method: 'get',
        params: query
    })
}


export function GetConfigMapDetail(query) {
    return request({
        url: '/api/k8s/configmap/detail',
        method: 'get',
        params: query
    })
}


export function UpdateConfigMap(query) {
    return request({
        url: '/api/k8s/configmap/update',
        method: 'put',
        params: query
    })
}

export function DeleteConfigMap(query) {
    return request({
        url: '/api/k8s/configmap/del',
        method: 'delete',
        params: query
    })
}


export function CreateConfigMap(data) {
    return request({
        url: '/api/k8s/configmap/create',
        method: 'post',
        data
    })
}

