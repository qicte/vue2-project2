<template>
    <div>
        <el-input style="width: 200px;margin-right: 10px;" v-model="tempSearchObj.roleName" placeholder="角色名称"></el-input>
        <el-button @click="search" type="primary" icon="el-icon-search">查询</el-button>
        <el-button @click="resetSearch">清空</el-button>
        <div class="div">
            <el-button type="primary" @click="addRole">添加</el-button>
            <el-button type="danger" @click="deleteSelect" :disabled="selectedIds.length === 0">批量删除</el-button>
        </div>
        <el-table border stripe style="width: 960px" v-loading="loading" :data="roles"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column type="index" label="序号" width="80" align="center">
            </el-table-column>
            <el-table-column label="角色名称">
                <template slot-scope="{row}">
                    <template v-if="row.edit">
                        <el-input v-model="row.roleName" class="edit-input" size="small" @blur="row.edit = false" />
                        <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning"
                            @click="cancelEdit(row)">
                            取消
                        </el-button>
                    </template>
                    <span v-else>{{ row.roleName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="300" align="center">
                <template slot-scope="{row}">
                    <HintButton size="mini" type="info" icon="el-icon-info" title="分配权限"
                        @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)" />

                    <HintButton size="mini" type="primary" icon="el-icon-check" title="确定" @click="updateRole(row)"
                        v-if="row.edit" />
                    <HintButton size="mini" type="primary" icon="el-icon-edit" title="修改角色" @click="row.edit = true"
                        v-if="!row.edit" />


                    <HintButton size="mini" type="danger" icon="el-icon-delete" title="删除角色" @click="removeRole(row)" />
                </template>
            </el-table-column>
        </el-table>
        <!-- @current-change="" -->
        <el-pagination @current-change="currentChange" :total="total" :current-page="page" :page-size="limit"
            :page-sizes="[3, 5, 10]" layout="prev,pager,next,jumper,->,sizes,total"
            @size-change="sizeChange"></el-pagination>


    </div>
</template>
<script>
export default {
    name: 'Role',
    data() {
        return {
            tempSearchObj: {
                roleName: ''
            },
            searchObj: {
                roleName: ''
            },
            page: 1,
            limit: 3,
            total: 0,
            roles: [],
            role: {},
            selectedIds: [],
            loading: false,
            user: {},
            dialogFormVisible: false,

        }
    },
    mounted() {
        this.getRole()
    },
    methods: {
        // 获取分页列表
        async getRole(pager = 1) {
            this.loading = true;
            this.page = pager;
            const { page, limit, searchObj } = this;
            let result = await this.$API.role.getPageList(page, limit, searchObj);
            this.loading = false;
            console.log(result.data)
            if (result.code == 20000) {
                const { items, total } = result.data;
                this.roles = items.map(item => {
                    item.edit = false // 用于标识是否显示编辑输入框的属性
                    item.originRoleName = item.roleName // 缓存角色名称, 用于取消
                    return item
                })
                this.total = total
                this.selectedIds = []
            }
        },
        /* 
    添加角色
    */
        addRole() {
            // 显示添加界面
            this.$prompt('请输入新名称', '添加角色', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.$API.role.save({ roleName: value }).then(result => {
                    this.$message.success(result.message || '添加角色成功')
                    this.getRole()
                })
            }).catch(() => {
                this.$message.warning('取消添加')
            })

        },

        // 点击查询事件
        search() {
            this.searchObj = { ...this.tempSearchObj }
            this.getRole()
        },
        // 清空搜索
        resetSearch() {
            this.searchObj = {
                roleName: ''
            };
            this.tempSearchObj = {
                roleName: ''
            };
            this.getRole()
        },
        showAdd() {
            this.role = {};
            this.dialogFormVisible = true;
            // this.$nextTick(() => this.$refs.roleForm.clearValidate())
        },
        // 删除选中的角色
        deleteSelect() {
            // console.log(this.selectedIds)
            this.$confirm('确认删除吗', '提示').then(async () => {
                let result = await this.$API.role.removeRoles(this.selectedIds)
                console.log(result)
                this.$message.success('删除成功')
                this.getRole()
            }).catch(() => {
                this.$message.info('取消删除')
            })
            // this.$confirm(`确定删除 '${roleName}' 吗?`, '提示', {
            //     type: 'warning'
            // }).then(async () => {
            //     const result = await this.$API.role.removeById(id)
            //     this.getRole(this.roles.length === 1 ? this.page - 1 : this.page)
            //     this.$message.success(result.message || '删除成功!')
            // }).catch(() => {
            //     this.$message.info('已取消删除')
            // })
        },
        // 复选框选中用户
        handleSelectionChange(role) {
            this.selectedIds = role.map(item => item.id)
        },
        // 页码改变
        currentChange(page) {
            this.getRole(page)
        },
        sizeChange(limit) {
            this.limit = limit;
            this.getUser();
        },
        updateRole(role) {
            role.edit = true;
        },
        cancelEdit(row) {
            row.edit = false
        },
        async removeRole(row) {
            const { id, roleName } = row;
            this.$confirm(`确定删除 '${roleName}' 吗?`, '提示', {
                type: 'warning'
            }).then(async () => {
                const result = await this.$API.role.removeById(id)
                this.getRole(this.roles.length === 1 ? this.page - 1 : this.page)
                this.$message.success(result.message || '删除成功!')
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        }
    }

}
</script>
<style scope></style>