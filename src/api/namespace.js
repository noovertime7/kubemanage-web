import request from "@/utils/request";


export function getNamespecelist(query) {
    return request({
        url: '/api/k8s/namespace/list',
        method: 'get',
        params: query
    })
}


export function GetNamespaceDetail(query) {
    return request({
        url: '/api/k8s/namespace/detail',
        method: 'get',
        params: query
    })
}


export function UpdateNamespace(query) {
    return request({
        url: '/api/k8s/namespace/update',
        method: 'put',
        params: query
    })
}

export function DeleteNamespace(query) {
    return request({
        url: '/api/k8s/namespace/del',
        method: 'delete',
        params: query
    })
}


export function CreateNamespace(data) {
    return request({
        url: '/api/k8s/namespace/create',
        method: 'post',
        data
    })
}

