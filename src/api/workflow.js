import request from "@/utils/request";

export function GetWorkflow(query) {
    return request({
        url: '/api/k8s/workflow/list',
        method: 'get',
        params: query
    })
}


export function GetWorkflowByID(query) {
    return request({
        url: '/api/k8s/workflow/id',
        method: 'get',
        params: query
    })
}


export function DeleteWorkflow(query) {
    return request({
        url: '/api/k8s/workflow/del',
        method: 'delete',
        params: query
    })
}


export function CreateWorkflow(data) {
    return request({
        url: '/api/k8s/workflow/create',
        method: 'post',
        data
    })
}

