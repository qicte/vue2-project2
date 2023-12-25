<template>
    <div>
        <!-- inline:代表行内表单 一行可以放置多个表单元素 -->
        <!-- :model:代表表单数据收集到这 -->
        <el-form :inline="true" class="demo-form-inline" :model="cForm">
            <el-form-item label="一级分类">
                <el-select placeholder="请选择" v-model="cForm.c1Id" :disabled="show">
                    <el-option v-for="(c1, index) in category1List" :key="c1.id" :label="c1.name"
                        :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select placeholder="请选择" v-model="cForm.c2Id" :disabled="show">
                    <el-option v-for="(c2, index) in category2List" :key="c2.id" :label="c2.name"
                        :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="show" placeholder="请选择" v-model="cForm.c3Id" @change="handler3">
                    <el-option v-for="(c3, index) in category3List" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import ResizeHandler from '@/layout/mixin/ResizeHandler';

export default {
    name: 'CategorySelect',
    data() {
        return {
            category1List: [],
            category2List: [],
            category3List: [],

            // 收集相应1 2 3 id
            cForm: {
                c1Id: '',
                c2Id: '',
                c3Id: ''
            },
        }
    },
    // 接收三级联动是否可操作性
    props: ['show'],
    mounted() {
        this.getCategory1List();
    },
    methods: {
        // 获取一级分裂数据
        async getCategory1List() {
            let result = await this.$API.attr.reqCategory1List();
            if (result.code == 200) {
                this.category1List = result.data
            }
        },
        // 当三级分类数据发生变化触发
        handler3() {
            // 触发自定义事件 getCategoryId将三级id发送给父组件  让父组件进行相关请求操作展示数据
            this.$emit('getCategoryId', { c1Id: this.cForm.c1Id, c2Id: this.cForm.c2Id, c3Id: this.cForm.c3Id, level: 3 })
        },

    },
    watch: {
        // 监测多级结构某个属性的变化
        'cForm.c1Id': {
            // 1级分类id变化触发
            async handler(newval, oldval) {
                // 把2 3级id清空
                this.cForm.c2Id = '';
                this.cForm.c3Id = ''
                // 发送请求二级列表
                let result = await this.$API.attr.reqCategory2List(newval);
                if (result.code == 200) {
                    // 请求成功
                    this.category2List = result.data
                    this.$emit('getCategoryId', { c1Id: this.cForm.c1Id, c2Id: this.cForm.c2Id, c3Id: this.cForm.c3Id })

                }
            }
        },
        'cForm.c2Id': {
            async handler(newval, oldval) {
                this.cForm.c3Id = '';
                if (newval) {
                    let result = await this.$API.attr.reqCategory3List(newval);
                    if (result.code == 200) {
                        // 请求成功
                        this.category3List = result.data
                        this.$emit('getCategoryId', { c1Id: this.cForm.c1Id, c2Id: this.cForm.c2Id, c3Id: this.cForm.c3Id })

                    }
                } else {
                    // 2级id为空时，三级数据为空
                    this.category3List = [];
                }

            }
        },
    }
}
</script>
<style></style>