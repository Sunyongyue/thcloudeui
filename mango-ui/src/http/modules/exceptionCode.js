import axios from '../axios'
// 查询
export const findPage = (data) => {
    return axios({
        url: '/exCode/view',
        method: 'post',
        data
    })
}
// 新增、编辑
export const save = (data) => {
    return axios({
        url: '/exCode/save',
        method: 'post',
        data
    })
}
// 删除
export const del = (data) => {
    return axios({
        url: '/exCode/del',
        method: 'post',
        data
    })
}