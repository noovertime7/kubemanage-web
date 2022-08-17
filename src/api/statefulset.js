import request from "@/utils/request";

export function GetStateFulSet(query) {
    return request({
        url: '/api/k8s/statefulset/list',
        method: 'get',
        params: query
    })
}




export function GetStateFulSetDetail(query) {
    return request({
        url: '/api/k8s/statefulset/detail',
        method: 'get',
        params: query
    })
}


export function UpdateStateFulSet(query) {
    return request({
        url: '/api/k8s/statefulset/update',
        method: 'put',
        params: query
    })
}

export function DeleteStateFulSet(query) {
    return request({
        url: '/api/k8s/statefulset/del',
        method: 'delete',
        params: query
    })
}
