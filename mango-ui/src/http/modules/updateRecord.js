import axios from '../axios'

/* 
 * 硬件升级记录管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/record/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/record/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/record/view',
        method: 'post',
        data
    })
}// 查询infoView
export const findInfoView = (data) => {
    return axios({
        url: '/record/infoView',
        method: 'post',
        data
    })
}// 修改的页面信息
export const modifyInfo = (data) => {
    return axios({
        url: '/record/modifyInfo',
        method: 'post',
        data
    })
}// 进行修改
export const modifyInfoOver = (data) => {
    return axios({
        url: '/record/modifyInfoOver',
        method: 'post',
        data
    })
}
// 进行删除
export const deleteInfo = (data) => {
    return axios({
        url: '/record/deleteInfo',
        method: 'post',
        data
    })
}
// 新增info
export const addInfo = (data) => {
    return axios({
        url: '/record/addInfo',
        method: 'post',
        data
    })
}
