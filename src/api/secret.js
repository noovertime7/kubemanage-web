import request from "@/utils/request";

export function GetSecret(query) {
    return request({
        url: '/api/k8s/secret/list',
        method: 'get',
        params: query
    })
}


export function GetSecretDetail(query) {
    return request({
        url: '/api/k8s/secret/detail',
        method: 'get',
        params: query
    })
}


export function UpdateSecret(query) {
    return request({
        url: '/api/k8s/secret/update',
        method: 'put',
        params: query
    })
}

export function DeleteSecret(query) {
    return request({
        url: '/api/k8s/secret/del',
        method: 'delete',
        params: query
    })
}


export function CreateSecret(data) {
    return request({
        url: '/api/k8s/secret/create',
        method: 'post',
        data
    })
}

