<template>
    <div>
        <el-card style="margin: 20px 0px;">
            <CategorySelect @getCategoryId='getCategoryId' :show="!isShowTable" />
        </el-card>
        <el-card>
            <div v-show="isShowTable">
                <el-button @click="addAttr" :disabled="!c3Id" type="primary" icon="el-icon-plus">添加属性</el-button>
                <!-- 表格 table-->
                <el-table style="width: 100%;" border :data="attrList">
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="属性名称" prop="attrName" width="150"></el-table-column>
                    <el-table-column label="属性值列表" width="width">
                        <template slot-scope="{row,$index}">
                            <el-tag style="margin:0px 20px;" type="success" v-for="(attrValue, index) in row.attrValueList"
                                :key="attrValue.id">{{
                                    attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="width">
                        <template slot-scope="{row,$index}">
                            <el-button type="warning" icon="el-icon-edit" @click="updateAttr(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete"></el-button>
                        </template>

                    </el-table-column>

                </el-table>
            </div>
            <div v-show="!isShowTable">
                <!-- inline表示表单是行显示 -->
                <el-form :model="attrInfo" :inline="true" label-width="80px">
                    <el-form-item label="属性名">
                        <el-input v-model="attrInfo.attrName" placeholder="请输入属性名"></el-input>
                    </el-form-item>
                </el-form>
                <el-button :disabled="!attrInfo.attrName" @click="addAttrValue" type="primary"
                    icon="el-icon-plus">添加属性值</el-button>
                <el-button @click="isShowTable = true">取消</el-button>
                <el-table :data="attrInfo.attrValueList" style="width: 100%;margin: 20px 0px;" border>
                    <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
                    <el-table-column label="属性值名称" width="width">
                        <template slot-scope="{row,$index}">
                            <!-- input与span来回切换 -->
                            <!-- 此处使用当每一次在添加属性值的时候添加标识，控制每一条的input还是span -->
                            <!-- v-model.trim  可让输入的数据去除头尾的空格 -->
                            <!-- ref使用$index  为了方便确定是哪一个 -->
                            <el-input :ref="$index" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)"
                                size="mini" v-model.trim="row.valueName" placeholder="请输入属性值"></el-input>
                            <!-- 设置为块级元素，不然只能点击文字才能修改 -->
                            <span v-else @click="toEdit(row, $index)" style="display: block;">{{
                                row.valueName
                            }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label='操作' width="width">
                        <template slot-scope="{row,$index}">
                            <!-- @confrim 代表点击确定 -->
                            <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                                <el-button type="danger" icon="el-icon-delete" slot="reference">删除</el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="primary" @click="saveAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
                <el-button @click="isShowTable = true">取消</el-button>

            </div>

        </el-card>

    </div>
</template>
<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'Attr',
    data() {
        return {
            c1Id: '',
            c2Id: '',
            c3Id: '',
            // 平台属性数据
            attrList: [],
            isShowTable: true,//显示还是隐藏table
            // 收集或修改属性的数据
            attrInfo: {
                attrName: '',
                attrValueList: [

                ],
                categoryId: '',
                categoryLevel: 3,
            },

        }
    },
    methods: {
        // 自定义事件的回调
        getCategoryId({ c1Id, c2Id, c3Id, level }) {
            console.log(level)
            this.c1Id = c1Id;
            this.c2Id = c2Id;
            this.c3Id = c3Id;
            console.log(level)
            if (level === 3) {
                this.getAttrList();
            }
        },
        // 获取平台属性数据
        async getAttrList() {
            let result = await this.$API.attr.reqAttrList(this.c1Id, this.c2Id, this.c3Id);
            console.log(result)
            if (result.code == 200) {
                this.attrList = result.data
            }
        },
        // 点击添加属性
        addAttr() {
            // 先隐藏table
            this.isShowTable = false;
            // 清空attrInfo的数据
            this.attrInfo = {
                attrName: '',
                attrValueList: [

                ],
                categoryId: this.c3Id,
                categoryLevel: 3,
            }

        },
        // 修改属性
        updateAttr(row) {
            this.isShowTable = false;
            // 此处若采用该 this.attrInfo=row  直接赋值给attrInfo，会让他们共用一个地址，任意一方的变化都会影响另外一方  当点击取消时也发现发生了变化
            // 解决方法：深拷贝（会重新给予一个地址  让两个变量互相不影响）
            this.attrInfo = cloneDeep(row)
            // 设置已有属性值的falg为false
            // 确定点击修改属性进行到编辑模式下属性值是查看模式
            this.attrInfo.attrValueList.forEach(item => {
                this.$set(item, 'flag', false)
            })
        },
        // 点击添加属性值 让table多一栏进行展示  并给每个栏添加标记
        addAttrValue() {
            let attrValueList = this.attrInfo.attrValueList
            let length = attrValueList.length;
            // 若已输入属性值，判断属性值是否重复
            // 重复则提示  并不可添加多一栏  除非数据不同
            if (length >= 1) {
                // 已经有值了
                // 先判断是否输入了属性值，没有不添加栏
                if (attrValueList[length - 1].valueName === '') {
                    this.$message({
                        message: '有未输入的属性值',
                        type: 'info'
                    })
                    return;
                }
                // 将数组的valueName进行map 再通过new set进行去重  比较长度
                let newLength = new Set(this.attrInfo.attrValueList.map(item => { item.valueName })).size;
                if (length > newLength) {
                    // 代表有重复的
                    console.log('名字重复了')
                    this.$message({
                        message: '不可输入重复的属性值',
                        type: 'info'
                    })
                    return;
                }
            }
            // 没有重复的，添加下一栏
            let attrValue = {
                // 添加属性时候，还没有相关属性id undefined
                // 修改属性时候，已经有相关属性id
                attrId: this.attrInfo.id,
                valueName: '',
                // 此时的flag是响应式数据  
                flag: true
            }
            this.attrInfo.attrValueList.push(attrValue)
            // 使其聚焦
            this.$nextTick(() => {
                this.$refs[length].focus()
            })
        },
        toLook(row) {
            // 如果输入框没有值，不进行切换到查看模式
            if (!row.valueName) {
                return;
            }
            row.flag = false

        },
        toEdit(row, $index) {
            row.flag = true;
            // 获取input
            // 需要注意，点击span，切换input为编辑模式，但是对于浏览器而言，页面重绘和重排消耗时间
            // 所以不可能一点击就获取到input
            // 解决方法
            // $nextTick  当节点渲染完毕，执行，
            // 使其聚焦
            this.$nextTick(() => {
                this.$refs[$index].focus()
            })
        },
        // popconfirm气泡确认框的确定事件
        deleteAttrValue(index) {
            console.log('delete')
            this.attrInfo.attrValueList.splice(index, 1)
        },
        // 添加属性与修改属性的保存操作
        async saveAttr() {
            // 验证 // 属性名不能为空
            if (this.attrInfo.attrName === '') {
                this.$message('属性名不能为空')
                return;
            }
            // 整理数据  给服务器的数据不能有flag字段
            this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item => {
                delete item.flag;
                return true;
            })

            // 发送请求
            let result = await this.$API.attr.reqSaveAttrInfo(this.attrInfo);
            if (result.code == 200) {
                // 保存成功 弹出提示框 并重新请求数据展示 回到表格 
                this.$message({
                    type: 'success',
                    message: '保存成功'
                })
                this.getAttrList();
                this.isShowTable = true;
            } else {
                this.$message('保存失败')
            }
        }



    }

}
</script>
<style></style>