import axios from '../axios'

/* 
 * 液晶显示
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/lcd/lcdAdd',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/lcd/lcdDel',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/lcd/lcdView',
        method: 'post',
        data
    })
}
// 删除照片
export const delPhoto = (data) => {
    return axios({
        url: '/lcd/delPhoto',
        method: 'post',
        data
    })
}
// 查询infoView
export const photoInfoView = (data) => {
    return axios({
        url: '/lcd/photoInfoView',
        method: 'post',
        data
    })
}
// 上传图片
export const uploadFile = (data) => {
    return axios({
        url: '/lcd/uploadFile',
        method: 'post',
        herders:{'Content-Type': 'multipart/form-data'},
        data
    })
}