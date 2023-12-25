<template>
    <div>
        <!-- 按钮 -->
        <el-button @click="showDialog" type="primary" icon="el-icon-plus" style="margin: 10px 0px;">添加</el-button>
        <!-- 
            表格组件 
            data:表格组件将来需要展示的数据----数组类型
            el-table-colmun代表每一列:
                  label:显示的标题，---字符串形式
                  width:对于列的宽度
                  align:标题的对齐方式
                  prop:对应列内容的字段名
            主要事项：elementui的table组件，展示的数据是以列进行展示
        -->
        <el-table :data="list" style="width: 100%" border>
            <!-- type='index' 展示序号 -->
            <el-table-column type="index" label="序号" width="80px" align="center">
            </el-table-column>
            <el-table-column prop="tmName" label="品牌名称" width="width">
            </el-table-column>
            <el-table-column label="品牌LOGO" width="width">
                <template slot-scope={row,$index}>
                    <!-- row:每一条数据  $index:索引值 -->
                    <img :src=row.logoUrl alt='' style="width: 100px;height: 100px;" />
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope={row,$index}>
                    <el-button @click="updateTradeMark(row)" type='warning' icon="el-icon-edit" size=mini>修改</el-button>
                    <el-button @click="deleteTradeMark(row)" type='danger' icon="el-icon-delete" size=mini>删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <!-- 
            分页器
            :current-page：当前页数 
            :total:数据总条数 
            :page-size:每一页展示条数 
            :page-sizes:每一页可以展示的数据
            :pager-count:7 按钮数量（大于5小于21的奇数） 连续页码数:7-2=5 默认5
            layout:里面编写各个展示的位置  ->代表后面的结构居右
            @currentChange：当前页数改变时触发
            @size-change:当每一页可以展示的数据发生变化时触发
        -->
        <el-pagination style="margin-top: 20px; textAlign: center;" :current-page="page" :total="total" :page-size="limit"
            :page-sizes="[3, 5, 10]" :pager-count="7" @current-change="getPageList" @size-change="handleSizeChange"
            layout="prev,pager,next,jumper,->,sizes,total"></el-pagination>

        <!-- 对话框dialog
            :visible.sync：控制对话框显示与隐藏
            -->
        <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
            <!--
                 form表单 
                 :model="tmForm":代表将表单数据收集到tmForm,将来表单验证也需要该属性
                表单验证：只需要通过rules属性传入约定的验证规则，并将Form-item的prop属性设置位需要校验的字段
            -->
            <el-form ref="ruleform" style="width: 80%;" :model="tmForm" :rules="rules">
                <el-form-item prop="tmName" label="品牌名称" label-width="100px">
                    <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
                </el-form-item>
                <el-form-item prop="logoUrl" label="品牌LOGO" label-width="100px">
                    <!-- upload上传 上传图片品牌logo 
                    :on-success="handleAvatarSuccess" ：图片上传成功回调
                    :before-upload="beforeAvatarUpload"：图片上传之前回调
                    action属性：设置图片上传的地址
                    :on-success:可以监测图片上传成功，当图片上传成功，会执行一次
                    ：before-upload:图片上传之前，执行一次
                    -->
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'TradeMark',
    data() {
        // rule:验证规则  value：表单值  callback：相当于放行函数
        var validateTmName = (rule, value, callback) => {
            // 自定义规则
            if (value.length < 2 || value.length > 10) {
                callback('长度在2-10个字符')
            } else {
                callback()
            }
        };
        return {
            page: 1,// 当前页数
            limit: 3,//每一页展示条数
            total: 0,//数据总数
            list: [],//列表数据
            dialogFormVisible: false,//控制对话框显示与隐藏
            tmForm: {
                tmName: '',
                logoUrl: ''
            },//收集的表单信息,对象身上的属性需要发送给服务器提交请求，不能写错
            // 表单验证规则
            rules: {
                // 品牌名称的验证规则
                tmName: [
                    // 必须填写       提示信息                   用户行为设置：blur失去焦点触发  change文本发生变化触发
                    { required: true, message: '请输入品牌名称', trigger: 'blur' },
                    // { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'change' }
                    // 自定义校验规则
                    { validator: validateTmName, trigger: 'change' }
                ],
                // 品牌logo的验证规则  此处是图片上传  不是表单  所以trigger可以去掉
                logoUrl: [
                    { required: true, message: '请上传品牌LOGO', }
                ],
            }
        }
    },
    mounted() {
        console.log(this.$API)
        // 获取列表数据方法  由于是分页器，需要不断发送请求，不止mounted的时候
        this.getPageList();
    },
    methods: {
        async getPageList(pager = 1) {
            this.page = pager
            let { page, limit } = this
            let result = await this.$API.trademark.reqTradeMarkList(page, limit);
            console.log(result);
            if (result.code === 200) {
                this.total = result.data.total;
                this.list = result.data.records;
            }

        },
        handleSizeChange(size) {
            this.limit = size;
            this.getPageList();
        },
        // 点击添加品牌
        showDialog() {
            this.dialogFormVisible = true
            // 清除数据：每次展开添加品牌时，品牌名称和品牌logo都应该被清空
            this.tmForm = { logoUrl: '', tmName: '' }
        },
        // 修改某个品牌
        updateTradeMark(row) {
            // row当前选中品牌的信息
            console.log(row)
            // 展示选中品牌名字和logo  并添加id
            // this.tmForm = { logoUrl: row.logoUrl, tmName: row.tmName, id: row.id }
            this.tmForm = { ...row }
            this.dialogFormVisible = true
        },
        // 删除品牌；
        deleteTradeMark(row) {
            this.$confirm(`你缺点删除${row.tmName}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 点击确定按钮触发
                // 发送删除请求
                try {
                    let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
                    console.log(result)
                    // 删除成功 
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    // // 再发送请求展示列表
                    this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
                } catch (error) {
                    //删除失败
                    this.$message({
                        type: 'info',
                        message: '删除失败!'
                    });
                }


            }).catch(() => {
                // 取消按钮触发
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 上传图片成功
        handleAvatarSuccess(res, file) {
            // res：上传成功返回的数据
            // file上传成功之后服务器返回前端数据
            this.tmForm.logoUrl = res.data;
        },
        //   // 上传图片之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },
        // 对话框的确认按钮  点击添加或者修改品牌信息
        addOrUpdateTradeMark() {
            // 点击确定按钮时 先判断所有验证是否已通过，再执行相关操作
            this.$refs.ruleform.validate(async (success) => {
                if (success) {
                    // 验证通过
                    this.dialogFormVisible = false;//隐藏对话框
                    // 发请求  （添加品牌或者修改品牌）
                    let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
                    if (result.code === 200) {
                        // 成功  弹出消息  elementui的message  添加品牌成功|修改品牌成功
                        this.$message({
                            type: 'success',
                            message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
                        })
                        //   添加或者修改品牌之后，重新获取列表信息展示
                        // 如果添加品牌：停留第一页，  修改品牌停留当页面
                        this.getPageList(this.tmForm.id ? this.page : 1);
                    }
                } else {
                    console.log('error submit')
                    return false
                }
            })

        }

    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>