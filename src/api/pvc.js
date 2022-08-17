import request from "@/utils/request";

export function GetPersistentVolumeClaim(query) {
    return request({
        url: '/api/k8s/persistentvolumeclaim/list',
        method: 'get',
        params: query
    })
}


export function GetPersistentVolumeClaimDetail(query) {
    return request({
        url: '/api/k8s/persistentvolumeclaim/detail',
        method: 'get',
        params: query
    })
}


export function UpdatePersistentVolumeClaim(query) {
    return request({
        url: '/api/k8s/persistentvolumeclaim/update',
        method: 'put',
        params: query
    })
}

export function DeletePersistentVolumeClaim(query) {
    return request({
        url: '/api/k8s/persistentvolumeclaim/del',
        method: 'delete',
        params: query
    })
}
