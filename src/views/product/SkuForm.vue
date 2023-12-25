<template>
    <div>
        <el-form ref="form" label-width='80px'>
            <el-form-item label="SPU名称">
                {{ spu.spuName }}
            </el-form-item>
            <el-form-item label="SKU名称">
                <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
            </el-form-item>
            <el-form-item label="价格(元)">
                <el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="重量(kg)">
                <el-input placeholder="重量(kg)" v-model="skuInfo.weight"></el-input>
            </el-form-item>
            <el-form-item label="规格描述">
                <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
            </el-form-item>
            <el-form-item label="平台属性">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
                        <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                            <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
                                v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-form :inline="true" ref="form" label-width="80px">
                    <el-form-item :label="sale.saleAttrName" v-for="(sale, index) in spuSaleAttrList" :key="sale.id">
                        <el-select placeholder="请选择" v-model="sale.saleAttrIdAndSaleValeId">
                            <el-option :label="saleValue.saleAttrName" :value="`${sale.id}:${saleValue.id}`"
                                v-for="(saleValue, index) in sale.spuSaleAttrValueList" :key="saleValue.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-form-item>
            <el-form-item label="图片列表">
                <el-table style="width: 100%;" border :data="spuImageList" @selection-change="handlerSelectionChange">
                    <el-table-column type="selection" width="80px"></el-table-column>
                    <el-table-column label="图片">
                        <template slot-scope="{row,$index}">
                            <img :src="row.imgUrl" style='width: 100px;height: 100px;' />
                        </template>
                    </el-table-column>
                    <el-table-column label="名称" prop="imgName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row,$index}">
                            <el-button type="primary" v-if="row.isDefault == '0'"
                                @click="ChangeDefault(row)">设为默认</el-button>
                            <el-button type="" v-else>默认</el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveSku">保存</el-button>
                <el-button @click="cancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    name: 'SkuForm',
    data() {
        return {
            spuImageList: [],
            spuSaleAttrList: [],
            attrInfoList: [],
            spu: '',//spu
            skuInfo: {
                // 父组件给数据的
                "category3Id": 0,
                "spuId": 0,
                "tmId": 0,
                // 表单收集
                "price": 0,
                "weight": '',
                "skuDesc": "",
                "skuName": "",
                // 书写代码发请求的
                // 平台属性
                "skuAttrValueList": [
                    // {
                    //     "attrId": 0,
                    //     "valueId": 0,
                    // }
                ],
                "skuDefaultImg": "",
                "skuImageList": [
                    // {
                    //     "id": 0,
                    //     "imgName": "string",
                    //     "imgUrl": "string",
                    //     "isDefault": "string",
                    //     "skuId": 0,
                    //     "spuImgId": 0
                    // }
                ],
                // 收集销售属性列表
                "skuSaleAttrValueList": [
                    // {
                    //     "saleAttrId": 0,
                    //     "saleAttrValueId": 0,
                    // }
                ],

            },
            // 收集图片的数据字段【缺少isDefault】
            tempImgInfoList: []
        }
    },
    methods: {
        // 获取数组
        async getData(c1Id, c2Id, spu) {
            // 收集spu
            this.spu = spu;
            // 收集父组件给的数据
            this.skuInfo.category3Id = spu.category3Id
            this.skuInfo.tmId = spu.tmId;
            this.skuInfo.spuId = spu.id;
            // 获取图片
            let result = await this.$API.spu.reqSpuImageList(spu.id)
            if (result.code == 200) {
                this.spuImageList = result.data;
                this.spuImageList.forEach(item => {
                    this.$set(item, 'isDefault', '0')
                })
            }
            // 获取销售属性数据
            let result1 = await this.$API.spu.reqspuSaleAttrList(spu.id);
            console.log('1', result1)
            if (result1.code == 200) {
                this.spuSaleAttrList = result1.data;
                this.spuSaleAttrList.forEach(item => {
                    this.$set(item, 'saleAttrIdAndSaleValeId', '')
                })
            }
            // 获取平台属性数据
            let result2 = await this.$API.spu.reqAttrInfoList(c1Id, c2Id, spu.category3Id)
            console.log('2', result2)
            if (result2.code === 200) {
                // attrIdAndValueId//暂时存放平台属性的attrId和ValueId  最后保存在整理参数到skuInfo中
                this.attrInfoList = result2.data;
                this.attrInfoList.forEach(item => {
                    this.$set(item, 'attrIdAndValueId', '')
                });

            }

        },
        // 图片表格复选框按钮事件
        handlerSelectionChange(imgInfo) {
            // imgInfo  选中的信息  注意：需要携带给服务器的图片参数 应该包含isDefault  但此时的参数没有该字段
            this.tempImgInfoList = imgInfo
        },
        // 改变图片的默认
        ChangeDefault(row) {
            // 排他
            this.spuImageList.forEach(item => {
                item.isDefault = '0'
            })
            row.isDefault = '1';
            // 收集默认图片地址
            this.skuInfo.skuDefaultImg = row.imgUrl;
        },
        // 保存sku
        async saveSku() {
            // 整理参数
            // 1平台属性数据  attrId  valueId
            // this.attrInfoList.forEach(item => {
            //     if (item.attrIdAndValueId) {
            //         const [attrId, valueId] = item.attrIdAndValueId.split(':')
            //         this.skuInfo.skuAttrValueList.push({
            //             attrId,
            //             valueId,
            //         })
            //     }
            // })
            this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(':')
                    prev.push({
                        attrId,
                        valueId,
                    })
                }
                return prev
            }, [])
            //    2.销售属性 skuSaleAttrValueList
            this.spuSaleAttrList.forEach(item => {
                if (item.saleAttrIdAndSaleValeId) {
                    const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndSaleValeId.split(':')
                    this.skuInfo.skuSaleAttrValueList.push({
                        saleAttrId,
                        saleAttrValueId,
                    })
                }
            })
            // 3图片
            this.skuInfo.skuImageList = this.tempImgInfoList.map(item => {
                console.log('tup')
                return {
                    imgName: item.imgName,
                    imgUrl: item.imgUrl,
                    isDefault: item.isDefault,
                    spuImgId: item.id,
                }
            })
            console.log(this.skuInfo)
            let result = await this.$API.spu.reqSaveSku(this.skuInfo)
            console.log(result)
            if (result.code == 200) {
                this.$message({
                    type: 'success',
                    message: '添加成功'
                })
                this.$emit('changeScene', 'update')
            }
            // 清除数据  重置
            Object.assign(this._data, this.$options.data())
        },
        cancel() {
            this.$emit('changeScene', 'update')
            // 清除数据
            Object.assign(this._data, this.$options.data())

        }
    }
}
</script>
<style></style>
