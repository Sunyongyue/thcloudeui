import axios from '../axios'
// 查询
export const findPage = (data) => {
    return axios({
        url: '/testPlan/testPlanView',
        method: 'post',
        data
    })
}
// 新增、编辑
export const save = (data) => {
    return axios({
        url: '/testPlan/save',
        method: 'post',
        data
    })
}
// 删除
export const del = (data) => {
    return axios({
        url: '/testPlan/del',
        method: 'post',
        data
    })
}
// 测试项内容
export const testTermView = (data) => {
    return axios({
        url: '/testPlan/testTermView',
        method: 'post',
        data
    })
}
// 上传图片
export const uploadFile = (data) => {
    return axios({
        url: '/testPlan/uploadFile',
        method: 'post',
        data
    })
}
