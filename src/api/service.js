import request from "@/utils/request";

export function GetService(query) {
    return request({
        url: '/api/k8s/service/list',
        method: 'get',
        params: query
    })
}


export function GetServiceDetail(query) {
    return request({
        url: '/api/k8s/service/detail',
        method: 'get',
        params: query
    })
}


export function UpdateService(query) {
    return request({
        url: '/api/k8s/service/update',
        method: 'put',
        params: query
    })
}

export function DeleteService(query) {
    return request({
        url: '/api/k8s/service/del',
        method: 'delete',
        params: query
    })
}


export function CreateService(data) {
    return request({
        url: '/api/k8s/service/create',
        method: 'post',
        data
    })
}

