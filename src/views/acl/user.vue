<template>
    <div>
        <el-input style="width: 200px;margin-right: 10px;" v-model="tempSearchObj.username" placeholder="用户名"></el-input>
        <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch">清空</el-button>
        <div class="div">
            <el-button type="primary" @click="showAdd">添加</el-button>
            <el-button type="danger" @click="deleteSelect" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <el-table border stripe v-loading="loading" :data="users" @selection-change="selectUser">
            <!-- type:selection 复选框 -->
            <el-table-column type="selection" width="80" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
            <el-table-column prop="username" label="用户名" width="width"></el-table-column>
            <el-table-column prop="nickName" label="用户昵称" width="width"></el-table-column>
            <el-table-column prop="roleName" label="权限列表" width="width"></el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" width="width"></el-table-column>
            <el-table-column prop="gmtModified" label="更新时间" width="width"></el-table-column>
            <el-table-column label="操作" width="width">
                <template slot-scope="{row,$index}">

                    <HintButton type="info" size="mini" icon="el-icon-user-solid" title="分配角色"
                        @click="showAssignRole(row)" />
                    <HintButton type="primary" size="mini" icon="el-icon-edit" title="修改用户" @click="showUpdate(row)" />
                    <el-popconfirm :title="`确定删除 ${row.username} 吗?`" @onConfirm="removeUser(row.id)">
                        <HintButton style="margin-left:10px" slot="reference" type="danger" size="mini"
                            icon="el-icon-delete" title="删除用户" />
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- @current-change="" -->
        <el-pagination @current-change="currentChange" :total="total" :current-page="page" :page-size="limit"
            :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->,sizes,total"
            @size-change="sizeChange"></el-pagination>
        <!-- 添加用户 对话框 -->
        <el-dialog :title="user.id ? '修改用户' : '添加用户'" :visible.sync="dialogFormVisible">
            <el-form :model="user" :rules="userRules" ref="userForm">
                <el-form-item label="用户名" required prop="username">
                    <el-input v-model="user.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input v-model="user.nickName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!user.id" label="用户密码" required prop="password">
                    <el-input v-model="user.password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'User',
    data() {
        return {
            tempSearchObj: {
                username: ''
            },
            searchObj: {
                username: ''
            },
            loading: false,
            page: 1,
            limit: 3,
            total: 0,
            users: [],
            selectedIds: [],
            dialogFormVisible: false,
            user: {},
            userRules: { // 用户添加/修改表单的校验规则
                username: [
                    { required: true, message: '用户名必须输入' },
                    { min: 4, message: '用户名不能小于4位' }
                ],
                password: [
                    { required: true, validator: this.validatePassword }
                ]
            },
        }
    },
    created() {
        console.log('11')
        this.getUser();
    },
    methods: {
        // 获取分页列表
        async getUser(pager = 1) {
            this.loading = true;
            this.page = pager;
            const { page, limit, searchObj } = this;
            let result = await this.$API.user.getPageList(page, limit, searchObj);
            this.loading = false;
            if (result.code == 20000) {
                const { items, total } = result.data;
                this.users = items.filter(item => {
                    return item.username !== 'admin'
                })
                this.total = total
                this.selectedIds = []
            }
        },
        // 点击查询事件
        search() {
            this.searchObj = { ...this.tempSearchObj }
            this.getUser()
        },
        // 页码改变
        currentChange(page) {
            this.getUser(page)
        },
        sizeChange(limit) {
            this.limit = limit;
            this.getUser();
        },
        // 清空搜索
        resetSearch() {
            this.searchObj = {
                username: ''
            };
            this.tempSearchObj = {
                username: ''
            },
                this.getUser()
        },
        showAdd() {
            this.user = {};
            this.dialogFormVisible = true;
            this.$nextTick(() => this.$refs.userForm.clearValidate())
        },
        // 添加或修改用户的对话框确认按钮事件
        addOrUpdateUser() {
            // 判断表单验证
            this.$nextTick(() => {
                this.$refs.userForm.validate(async (valid) => {
                    if (valid) {
                        //    验证通过
                        //判断是add还是update
                        const { user } = this;
                        if (user.id) {
                            // 修改
                            let result = await this.$API.user.update(user)
                            if (result.code == 20000) {
                                this.$message.success('修改成功')
                            }
                        } else {
                            // add
                            let result = await this.$API.user.add(user)
                            if (result.code == 20000) {
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                })
                            }

                        }
                        this.dialogFormVisible = false;
                        this.getUser()
                    } else {
                        // 验证失败
                        console.log('数据输入有误');
                        return false;
                    }
                });
            })

        },
        // 显示update对话框
        showUpdate(user) {
            this.user = user;
            this.dialogFormVisible = true;
            this.$nextTick(() => this.$refs.userForm.clearValidate())

        },
        // 复选框选中用户
        selectUser(user) {
            this.selectedIds = user.map(item => item.id)
        },
        // 删除选中的用户
        deleteSelect() {
            console.log(this.selectedIds)
            this.$confirm('确认删除吗').then(async () => {
                let result = await this.$API.user.removeUsers(this.selectedIds)
                console.log(result)
                this.$message.success('删除成功')
                this.getUser()
            }).catch(() => {
                this.$message.info('取消删除')
            })
        },
        async removeUser(id) {
            let result = await this.$API.user.removeById(id)
            console.log(result)
            if (result.code === 20000) {
                this.$message.success('删除成功')
            }
            this.getUser()
        },

        // 自定义校验规则
        validatePassword(rule, value, callback) {
            if (!value) {
                callback('密码必须输入')
            } else if (!value || value.length < 6) {
                callback('密码不能小于6位')
            } else {
                callback()
            }
        },

    }
}
</script>
<style scope>
.div {
    margin: 10px 0px;
}
</style>