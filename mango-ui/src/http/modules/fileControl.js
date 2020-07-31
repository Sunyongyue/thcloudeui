import axios from '../axios'
// 查询
export const findPage = (data) => {
    return axios({
        url: '/fileControl/view',
        method: 'post',
        data
    })
}
// 新增、编辑
export const save = (data) => {
    return axios({
        url: '/fileControl/save',
        method: 'post',
        data
    })
}
// 删除
export const del = (data) => {
    return axios({
        url: '/fileControl/del',
        method: 'post',
        data
    })
}
// 上传文件
export const uploadFile = (data) => {
    return axios({
        url: '/fileControl/uploadFile',
        method: 'post',
        herders:{'Content-Type': 'multipart/form-data'},
        data
    })
}