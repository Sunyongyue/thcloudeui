import axios from '../axios'
// 查询
export const findPage = (data) => {
    return axios({
        url: '/fastMail/view',
        method: 'post',
        data
    })
}
// 新增、编辑
export const save = (data) => {
    return axios({
        url: '/fastMail/save',
        method: 'post',
        data
    })
}
// 删除
export const del = (data) => {
    return axios({
        url: '/fastMail/del',
        method: 'post',
        data
    })
}
// 上传图片
export const uploadFile = (data) => {
    return axios({
        url: '/fastMail/uploadFile',
        method: 'post',
        herders:{'Content-Type': 'multipart/form-data'},
        data
    })
}