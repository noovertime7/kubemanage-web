import request from "@/utils/request";


export function getNodeList(query) {
    return request({
        url: '/api/k8s/node/list',
        method: 'get',
        params: query
    })
}


export function GetNodeDetail(query) {
    return request({
        url: '/api/k8s/node/detail',
        method: 'get',
        params: query
    })
}


export function UpdateNode(query) {
    return request({
        url: '/api/k8s/node/update',
        method: 'put',
        params: query
    })
}

export function DeleteNode(query) {
    return request({
        url: '/api/k8s/node/del',
        method: 'delete',
        params: query
    })
}


export function CreateNode(data) {
    return request({
        url: '/api/k8s/node/create',
        method: 'post',
        data
    })
}

