// spu数据接口
// 获取spu数据
import request from '@/utils/request'

export const reqSpuList = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    methods: 'get',
    params: {
        category3Id,
    }
})
// 获取品牌信息
export const reqTradeMarkList = () => request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
})
// 获取销售属性信息
export const reqBaseSaleAttrList = () => request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
})
// 获取某个sup信息
export const reqSpuInfo = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})
// 获取spu图片信息
export const reqSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})
// 保存(修改|添加）spuForm信息  修改需要携带id
export const reqSaveSpuSaleAttr = (spuInfo) => {
    // 是否携带id
    if (spuInfo.id) {
        // 修改
        return request({
            url: '/admin/product/updateSpuInfo',
            method: 'post',
            data: spuInfo,
        })
    } else {
        // 添加
        return request({
            url: '/admin/product/saveSpuInfo',
            method: 'post',
            data: spuInfo
        })
    }

}
// 删除spu
export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})

// sku


// 获取销售属性
export const reqspuSaleAttrList = (spuId) => request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
})
// 获取平台属性数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})
// 保存添加sku
export const reqSaveSku = (skuInfo) => request({
    url: '/admin/product/saveSkuInfo',
    method: 'post',
    data: skuInfo
})
// 获取sku列表数据接口
export const reqSkuList = (spuId) => request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
})