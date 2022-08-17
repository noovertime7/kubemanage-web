import request from "@/utils/request";

export function GetPersistentVolume(query) {
    return request({
        url: '/api/k8s/persistentvolume/list',
        method: 'get',
        params: query
    })
}


export function GetPersistentVolumeDetail(query) {
    return request({
        url: '/api/k8s/persistentvolume/detail',
        method: 'get',
        params: query
    })
}


export function UpdatePersistentVolume(query) {
    return request({
        url: '/api/k8s/persistentvolume/update',
        method: 'put',
        params: query
    })
}

export function DeletePersistentVolume(query) {
    return request({
        url: '/api/k8s/persistentvolume/del',
        method: 'delete',
        params: query
    })
}
