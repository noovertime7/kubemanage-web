import request from "@/utils/request";

export function GetDaemonSet(query) {
    return request({
        url: '/api/k8s/daemonset/list',
        method: 'get',
        params: query
    })
}


export function GetDaemonSetDetail(query) {
    return request({
        url: '/api/k8s/daemonset/detail',
        method: 'get',
        params: query
    })
}


export function UpdateDaemonSet(query) {
    return request({
        url: '/api/k8s/daemonset/update',
        method: 'put',
        params: query
    })
}

export function DeleteDaemonSet(query) {
    return request({
        url: '/api/k8s/daemonset/del',
        method: 'delete',
        params: query
    })
}
