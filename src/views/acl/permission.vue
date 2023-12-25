<template>
    <div>
        <!--  :data="tableData"  -->

        <el-table :data="permissionList" style="width: 100%;margin-bottom: 20px;" row-key="id" border
            :expand-row-keys="expandKeys">
            <el-table-column prop="name" label="名称" width="width">
            </el-table-column>
            <el-table-column prop="code" label="权限值" width="width">
            </el-table-column>
            <el-table-column prop="toCode" label="跳转权限值">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                    <HintButton @click="showAdd(row)" type="primary" icon="el-icon-plus" :title="getAddTitle(row.level)">
                    </HintButton>
                    <HintButton @click="showEdit(row)" type="primary" icon="el-icon-edit"></HintButton>
                    <HintButton @click="removePermission(row)" type="danger" icon="el-icon-delete"></HintButton>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" @close="resetData">
            <el-form :model="permission" ref="permission" :rules="permissionRules">
                <el-form-item label="父级名称" v-if="permission.level > 2 && !permission.id">
                    <el-input :value="permission.pname" disabled />
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="permission.name" />
                </el-form-item>

                <el-form-item label="功能权限值" prop="code">
                    <el-input v-model="permission.code" />
                </el-form-item>

                <el-form-item label="跳转路由权限值" prop="toCode" v-if="permission.level === 4">
                    <el-input v-model="permission.toCode" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addorUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
// 菜单权限校验的规则
const menuRules = {
    name: [{ required: true, message: '名称必须输入' }],
    code: [{ required: true, message: '权限值必须输入' }],
}

// 按钮功能权限校验的规则
const btnRules = {
    name: [{ required: true, message: '名称必须输入' }],
    code: [{ required: true, trigger: 'blur', message: '功能权限值必须输入' }]
}

export default {

    name: 'Permission',
    data() {
        return {
            permissionList: [],
            expandKeys: [],
            permission: {},
            dialogFormVisible: false,
            form: {},//收集表单数据
        }
    },
    mounted() {
        this.getPermissions();
    },
    methods: {
        // 获取列表
        async getPermissions() {
            let result = await this.$API.permission.getPermissionList();
            console.log(result)
            if (result.code == 20000) {
                this.permissionList = result.data.children;
                this.expandKeys = [this.permissionList[0].id]
            }
        },
        showAdd(row) {
            this.dialogFormVisible = true;
            this.permission.pid = row.id
            this.permission.level = row.level + 1
            this.permission.type = this.permission.level === 4 ? 2 : 1
            this.permission.pname = row.name // 用于显示父名称, 但提交请求时是不需要的
            // 清除校验(必须在界面更新之后)
            this.$nextTick(() => this.$refs.permission.clearValidate())
        },
        showEdit(row) {
            this.dialogFormVisible = true
            this.permission = { ...row }  // 使用浅拷贝
            this.permission.type = this.permission.level === 4 ? 2 : 1

            // 清除校验(必须在界面更新之后)
            this.$nextTick(() => this.$refs.permission.clearValidate())
        },
        /* 
重置数据
*/
        resetData() {
            this.dialogPermissionVisible = false
            this.permission = {
                level: 0,
                name: '',
                code: '',
                toCode: ''
            }
        },
        /* 
根据级别得到要显示的添加dialog的标题
*/
        getAddTitle(level) {
            if (level === 1 || level === 2) {
                return '添加菜单'
            } else if (level === 3) {
                return '添加功能'
            }
        },

        addorUpdate() {
            this.$refs.permission.validate(async valid => {
                if (valid) {
                    const { pname, ...perm } = this.permission // pname不需要携带
                    const result = await this.$API.permission[perm.id ? 'updatePermission' : 'addPermission'](perm)
                    this.$message.success(result.message || `${perm.id ? '修改' : '添加'}成功!`)
                    this.resetData()
                    this.getPermissions()
                }
            })
            this.dialogFormVisible = false;
        },
        removePermission(row) {
            this.$confirm(`确认删除${row.name}吗？`, '提示', {
                type: 'warning'
            }).then(async () => {
                let result = await this.$API.permission.removePermission(row.id);
                if (result.code == 200 || result.code == 20000) {
                    this.$message.success('删除成功')
                    this.getPermissions()

                }
            }).catch(() => {
                this.$messgae.info('取消删除')
            })

        }



    },
    computed: {
        /* 
根据权限的等级来计算确定校验规则
*/
        permissionRules() {
            return this.permission.level === 4 ? btnRules : menuRules
        },
        /* 
  动态计算得到Dialog的标题
  */
        dialogTitle() {
            const { id, level } = this.permission
            if (id) {
                return level === 4 ? '修改功能' : '修改菜单'
            } else {
                return level === 4 ? '添加功能' : `添加${level === 2 ? '一级' : '二级'}菜单`
            }
        },
    }
}
</script>
<style scope></style>