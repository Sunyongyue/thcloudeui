import axios from '../axios'
// 查询
export const findAll = (data) => {
    return axios({
        url: '/testTem/templateView',
        method: 'post',
        data
    })
}
// 新增、编辑
export const save = (data) => {
    return axios({
        url: '/testTem/save',
        method: 'post',
        data
    })
}
//删除
export const del = (data) => {
    return axios({
        url: '/testTem/del',
        method: 'post',
        data
    })
}
//查询二级大项
export const two = (data) => {
    return axios({
        url: '/testTem/two',
        method: 'post',
        data
    })
}
//查询二级大项
export const one = (data) => {
    return axios({
        url: '/testTem/one',
        method: 'post',
        data
    })
}
//更新排序
export const updateSort = (data) => {
    return axios({
        url: '/testTem/updateSort',
        method: 'post',
        data
    })
}
//更新排序
export const findAllPop = (data) => {
    return axios({
        url: '/testTem/findAllPop',
        method: 'post',
        data
    })
}
