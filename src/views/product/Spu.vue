<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId='getCategoryId' :show="scene == 0 ? false : true" />
        </el-card>
        <el-card>
            <!-- 此处三部分进行切换 -->
            <div v-show="scene == 0">
                <!-- 展示spu列表的结构 :disabled="!category3Id"-->
                <el-button type='primary' icon='el-icon-plus' @click="addSpu" :disabled="!c3Id">添加SPU</el-button>
                <el-table style="width: 100%" border :data="records">
                    <!-- type='index' 展示序号 -->
                    <el-table-column type="index" label="序号" width="80px" align="center">
                    </el-table-column>
                    <el-table-column prop="spuName" label="SPU名称" width="width">
                    </el-table-column>
                    <el-table-column prop="description" label="SPU描述" width="width">

                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope={row,$index}>
                            <HintButton type='success' icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)">
                            </HintButton>
                            <HintButton type='warning' icon="el-icon-edit" size="mini" title="修改sku"
                                @click="updateSpu(row)">
                            </HintButton>
                            <HintButton type='info' icon="el-icon-info" size="mini" title="查看sku" @click="showSku(row)">
                            </HintButton>
                            <el-popconfirm :title="`确认删除${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                                <HintButton slot="reference" type='danger' icon="el-icon-delete" size="mini" title="删除sku">
                                </HintButton>

                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页器  -->
                <el-pagination style="margin-top: 20px; textAlign: center;" :current-page="page" :total="total"
                    :page-size="limit" :page-sizes="[3, 5, 10]" :pager-count="7"
                    layout="prev,pager,next,jumper,->,sizes,total" @size-change="handleSizeChange"
                    @current-change="getSpuList"></el-pagination>

            </div>
            <!-- 添加|修改spu -->
            <SpuForm ref="spuform" v-show='scene == 1' @changeScene="changeScene"></SpuForm>
            <!-- 添加sku -->
            <SkuForm ref="skuform" v-show='scene == 2' @changeScene="changeScene"></SkuForm>
        </el-card>
        <!-- 对话框  查看sku列表 -->
        <el-dialog :before-close="close" :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible">
            <el-table :data="skuList" v-loading="loading">
                <el-table-column property="skuName" label="名称" width="150"></el-table-column>
                <el-table-column property="price" label="价格" width="200"></el-table-column>
                <el-table-column property="weight" label="重量"></el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="{row,$index}">
                        <img v-if="row.skuDefaultImg" :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;" />
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import SpuForm from './SpuForm.vue'
import SkuForm from './SkuForm.vue'

export default {
    name: 'Spu',
    data() {
        return {
            c1Id: '',
            c2Id: '',
            c3Id: '',
            scene: 0,//0代表Spu列表数据  1代表添加|修改  2代表添加Sku
            page: 1,
            limit: 3,
            records: [],//列表数据
            total: 0,//总数
            dialogTableVisible: false,
            spu: {},//存放点击查看sku列表时的spu
            skuList: [],
            loading: true,
        }
    },
    components: {
        SpuForm,
        SkuForm
    },
    methods: {
        changeScene(type) {
            this.scene = 0;
            if (type === 'update') {
                this.getSpuList(this.page)
            } else {
                this.getSpuList()
            }
        },
        // 三级联动自定义事件，可以把子组件的id传给父组件
        getCategoryId({ c1Id, c2Id, c3Id, level }) {
            console.log(level)
            this.c1Id = c1Id;
            this.c2Id = c2Id;
            this.c3Id = c3Id;
            console.log(level)
            if (level === 3) {
                this.getSpuList();
            }
        },
        // 获取spu列表数据
        async getSpuList(pager = 1) {
            this.page = pager
            console.log(this.page)
            // 发送请求
            let { page, limit, c3Id } = this;
            console.log(page, limit, c3Id)
            let result = await this.$API.spu.reqSpuList(page, limit, c3Id)
            if (result.code = 200) {
                this.total = result.data.total;
                this.records = result.data.records;
            }
        },
        // 处理每一页展示数据发生变化的回调
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSpuList()
        },
        // 添加按钮
        addSpu() {
            this.scene = 1
            this.$refs.spuform.initSpuData(this.c3Id)
        },
        updateSpu(row) {
            this.scene = 1;
            // 获取子组件spuForm实例对象中的发送请求获取数据
            this.$refs.spuform.initSpuData(row);

        },
        // 添加SKU
        addSku(row) {
            this.scene = 2;
            this.$refs.skuform.getData(this.c1Id, this.c2Id, row)

        },
        // 删除spu
        async deleteSpu(row) {
            console.log(row)
            let result = await this.$API.spu.reqDeleteSpu(row.id);
            console.log(result);
            if (result.code == 200) {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
            }
            this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
        },
        //查看sku
        async showSku(row) {
            console.log(row)
            // 点击弹出对话框
            this.dialogTableVisible = true;
            this.spu = row;
            let result = await this.$API.spu.reqSkuList(row.id)
            console.log(result)
            if (result.code == 200) {
                this.skuList = result.data;
                this.loading = false;
            }

        },
        close(done) {
            this.loading = true;
            this.skuList = [];
            done()
        }

    }
}
</script>
<style></style>