// 主要获取品牌管理列表数据
import request from '@/utils/request'

// 获取品牌管理列表接口
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})
// 添加品牌  修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    if (tradeMark.id) {
        // 带有id  ----修改
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'put',
            data: tradeMark
        })
    } else {
        // 添加品牌
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data: tradeMark
        })
    }
}
// 删除品牌
export const reqDeleteTradeMark = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})
