<template>
    <div>
        <el-table style="width: 100%;" :data="skuList" border>
            <el-table-column label="序号" type="index" width="80" align="center">
            </el-table-column>
            <el-table-column prop="skuName" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width">
            </el-table-column>
            <el-table-column label="默认图片" width="110">
                <template slot-scope="{row,$index}">
                    <img v-if="row.skuDefaultImg" :src="row.skuDefaultImg" alt="" style="width: 80px;height:80px;">
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="80">
            </el-table-column>
            <el-table-column label="操作" width="width">
                <template slot-scope="{row,$index}">
                    <el-button @click="onSale(row)" v-if="row.isSale == 0" type="success" icon="el-icon-sort-down"
                        size="mini"></el-button>
                    <el-button @click="cancelSale(row)" v-else type="success" icon="el-icon-sort-up"
                        size="mini"></el-button>
                    <el-button @click="edit" type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button @click="showSku(row)" type="info" icon="el-icon-info" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页器 @current-change=""-->
        <el-pagination @size-change="handleSizeChange" @current-change="getSkuList" style="text-align: center;"
            :total="total" :current-page="page" :page-size="limit" :page-sizes="[3, 5, 10]"
            layout="prev,pager,next,jumper,->,sizes,total">

        </el-pagination>
        <!-- 抽屉效果  :direction="direction"默认值 从右往左
              :show-close="false"不显示关闭按钮-->
        <el-drawer :visible.sync="drawer" :show-close="false" size="50%">
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{ skuInfo.skuName }}</el-col>

            </el-row>
            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>

            </el-row>
            <el-row>
                <el-col :span="5">价格(元)</el-col>
                <el-col :span="16">s{{ skuInfo.price }}</el-col>

            </el-row>
            <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag type="success" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id">
                            {{ attr.attrId }}-{{ attr.valueId }}
                        </el-tag>
                    </template>
                </el-col>

            </el-row>
            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <el-carousel height="150px">
                        <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                            <img :src="item.imgUrl" alt="" />
                        </el-carousel-item>
                    </el-carousel></el-col>
            </el-row>
        </el-drawer>
    </div>
</template>
<script>
export default {
    name: 'Sku',
    data() {
        return {
            page: 1,
            limit: 3,
            skuList: [],
            total: 0,
            skuInfo: [],//存储sku详情信息
            drawer: false,//抽屉是否显示

        }
    },
    mounted() {
        this.getSkuList();
    },
    methods: {
        // 获取sku列表数据
        async getSkuList(pager = 1) {
            this.page = pager
            let result = await this.$API.sku.reqSkuList(this.page, this.limit)
            console.log(result);
            if (result.code == 200) {
                const { size, records, total } = result.data
                this.skuList = records;
                this.total = total
            }
        },
        // 分页器size发生变化时
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSkuList()
        },
        // 上架
        async onSale(sku) {
            let result = await this.$API.sku.reqOnSale(sku.id)
            if (result.code == 200) {
                sku.isSale = 1;
                this.$message({
                    type: 'success',
                    message: '上架成功'
                })
            }
        },
        // 下架
        async cancelSale(sku) {
            let result = await this.$API.sku.reqCancelSale(sku.id)
            if (result.code == 200) {
                sku.isSale = 0;
                this.$message({
                    type: 'success',
                    message: '下架成功'
                })
            }
        },
        edit() {
            this.$message('正在开发中')
        },
        // 查看sku详情
        async showSku(sku) {
            this.drawer = true
            let result = await this.$API.sku.reqSkuById(sku.id)
            if (result.code == 200) {
                this.skuInfo = result.data
            }
        }
    },
}
</script>


<style scoped>
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
    font-weight: 700;
}

.el-col {
    margin: 10px 10px;
}


/* 深度选择器 不加上对轮播图不起效果*/
>>>.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

>>>.el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
}

>>>.el-carousel__button {
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
}
</style>