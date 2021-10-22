<template>
  <permission-checker :projectName="projectName"
                      role="owner">
    <div class="roles-container">
      <el-dialog class="form"
                 title="添加角色"
                 :visible.sync="dialogRoleAddFormVisible">
        <el-form :model="form"
                 ref="form"
                 :rules="formRules">
          <el-form-item label="角色名称"
                        prop="name"
                        label-width="100px">
            <el-input v-model="form.name"
                      size="small"
                      :disabled="form.name === 'all-users'"
                      placeholder="请输入角色名称">
            </el-input>
          </el-form-item>
          <el-form-item label="权限列表"
                        prop="permissionUUIDs"
                        label-width="100px">
            <div class="permissions-group"
                 v-for="(group,group_index) in permissionGroups"
                 :key="group_index">
              <el-checkbox :label="group.name"
                           :value="calculatePermissionGroupsCheckedState(group.name)"
                           :key="group.name"
                           :indeterminate="calculatePermissionGroupsIndeterminateState(group.name)"
                           @change="handlePermissionGroupChange(group.name)">{{group.name}}
              </el-checkbox>
              <div class="sub-permissions">
                <el-checkbox-group v-model="form.permissionUUIDs">
                  <div v-for="(row,row_index) in getPermissionRow(group.subPermissions)"
                       :key="row_index">
                    <el-checkbox class="sub-permissions-checkbox"
                                 v-for="(subPermission,sub_index) in row.items"
                                 :key="sub_index"
                                 :label="subPermission.uuid">{{subPermission.name}}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button size="small"
                     @click="dialogRoleAddFormVisible = false">取 消</el-button>
          <el-button size="small"
                     @click="submit()"
                     type="primary">确 定</el-button>
        </div>
      </el-dialog>

      <div class="tab-container">
        <el-tabs @tab-click="changeRoute"
                 v-model="activeTab"
                 :tab-position="tabPosition"
                 type="card"
                 style="height: 200px;">
          <el-tab-pane name="member"
                       label="成员管理">
          </el-tab-pane>
          <el-tab-pane name="role"
                       label="角色管理">
            <el-alert type="info"
                      :closable="false"
                      description="项目角色管理，主要用于管理项目资源的权限与角色之间的对应关系">
            </el-alert>

            <div class="sync-container">
              <el-button plain
                         @click="handleAdd()"
                         size="small"
                         type="primary">创建角色</el-button>
            </div>

            <el-table v-loading="loading"
                      row-key="id"
                      :data="roles"
                      style="width: 100%;">
              <el-table-column label="角色名称">
                <template slot-scope="scope">
                  <span>{{scope.row.role.name}}</span>
                </template>
              </el-table-column>
              <el-table-column label="修改人">
                <template slot-scope="scope">
                  <span>{{scope.row.role.updateBy}}</span>
                </template>
              </el-table-column>
              <el-table-column label="最后修改时间">
                <template slot-scope="scope">
                  {{scope.row.role.updatedAt ? formatTime(scope.row.role.updatedAt): 'N/A'}}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope"
                          v-if="scope.row.role.id > 6">
                  <el-button type="primary"
                             size="mini"
                             plain
                             @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="mini"
                             v-if="scope.row.role.name !== 'all-users'"
                             type="danger"
                             @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  <el-button size="mini"
                             v-if="scope.row.role.name === 'all-users' && scope.row.type !== 'all-users'"
                             type="danger"
                             @click="handleDelete(scope.$index, scope.row)">清空</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </permission-checker>
</template>

<script>
import { getProjectRolesAPI, getRolePermissionsAPI, createRoleAPI, updateRoleAPI, bindRoleToProjectAPI, unbindRoleFromProjectAPI, deleteRoleAPI, assignPermissionToRoleAPI } from '@api'
import { permissions } from '@utils/permission_list'
import _ from 'lodash'
import moment from 'moment'
import bus from '@utils/event_bus'

const initFormData = {
  id: '',
  name: '',
  roleType: 2,
  permissionUUIDs: []
}

export default {
  data () {
    const nameValidator = (rule, value, callback, source, options) => {
      for (const role of this.roles) {
        if (role.name === value && role.id !== this.form.id) {
          callback(new Error('角色名称已存在，请修改'))
        }
      }

      callback()
    }

    return {
      tabPosition: 'top',
      roles: [],
      form: _.cloneDeep(initFormData),
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: nameValidator, trigger: 'blur' }
        ],
        permissionUUIDs: [
          { type: 'array', required: true, message: '请选择至少一个权限', trigger: 'change' }
        ]
      },
      loading: true,
      activeTab: '',
      dialogRoleAddFormVisible: false
    }
  },
  methods: {
    async handleEdit (index, row) {
      if (row.type === 'all-users') { // 如果是第一次编辑alluser
        this.initNewForm()
        this.form.name = row.role.name
        this.dialogRoleAddFormVisible = true
      } else {
        await this.initEditForm(row.role.id, row.role.name)
        this.dialogRoleAddFormVisible = true
        this.resetForm()
      }
    },
    async handleDelete (index, row) {
      const title = row.role.name === 'all-users' ? '清空' : '删除'
      try {
        await this.$confirm(`确定${title}这个角色吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const productName = this.projectName
        const roleId = row.role.id

        await unbindRoleFromProjectAPI({
          roleId,
          productName
        })

        await deleteRoleAPI({
          productName,
          roleId
        })

        this.$message({
          message: '删除角色成功',
          type: 'success'
        })

        await this.getRoles()
      } catch (e) { }
    },
    handleAdd () {
      this.initNewForm()
      this.resetForm()
      this.dialogRoleAddFormVisible = true
    },
    handlePermissionGroupChange (groupName) {
      const groupDetail = this.permissionGroups.find((item) => item.name === groupName)
      const subPermissionUUIDs = groupDetail !== null
        ? groupDetail.subPermissions.map((item) => {
          return item.uuid
        })
        : null
      const isSelecting = !!(groupDetail !== null && !this.calculatePermissionGroupsCheckedState(groupName))

      if (subPermissionUUIDs) {
        if (isSelecting) {
          this.form.permissionUUIDs = _.uniq(this.form.permissionUUIDs.concat(subPermissionUUIDs))
        } else {
          this.form.permissionUUIDs = this.form.permissionUUIDs.filter((item) => {
            return !subPermissionUUIDs.includes(item)
          })
        }
      }
    },
    getPermissionRow (subPermissions) {
      const rows = []

      for (const permission of subPermissions) {
        const row = rows.find(item => item.name === permission.row)

        if (row) {
          row.items.push(permission)
        } else {
          rows.push({
            name: permission.row,
            items: [permission]
          })
        }
      }

      return rows
    },
    calculatePermissionGroupsCheckedState (groupName) {
      const groupDetail = this.permissionGroups.find((item) => item.name === groupName)
      const subPermissionUUIDs = groupDetail !== null
        ? groupDetail.subPermissions.map((item) => {
          return item.uuid
        })
        : null

      if (subPermissionUUIDs) {
        const permissionDiff = _.difference(subPermissionUUIDs, this.form.permissionUUIDs)

        if (permissionDiff.length === 0) {
          return true
        }
      }

      return false
    },
    calculatePermissionGroupsIndeterminateState (groupName) {
      const groupDetail = this.permissionGroups.find((item) => item.name === groupName)
      const subPermissionUUIDs = groupDetail !== null
        ? groupDetail.subPermissions.map((item) => {
          return item.uuid
        })
        : null

      if (subPermissionUUIDs) {
        const permissionDiff = _.difference(subPermissionUUIDs, this.form.permissionUUIDs)

        if (permissionDiff.length > 0 && permissionDiff.length < subPermissionUUIDs.length) {
          return true
        }
      }

      return false
    },
    formatTime (unix) {
      if (unix === 0) {
        return '-'
      }

      return moment.unix(unix).format('YYYY-MM-DD HH:mm:ss')
    },
    initNewForm () {
      this.form = _.cloneDeep(initFormData)
    },
    resetForm () {
      if (this.$refs.form) {
        setTimeout(() => this.$refs.form.clearValidate())
      }
    },
    async initEditForm (roleId, roleName) {
      const productName = this.projectName
      const roleType = 2
      const resp = await getRolePermissionsAPI({ productName, roleType, roleId })

      const permissionUUIDs = resp.map(item => item.permissionUUID)

      const newForm = _.cloneDeep(initFormData)

      newForm.id = roleId
      newForm.name = roleName
      newForm.permissionUUIDs = permissionUUIDs

      this.form = newForm
    },
    async getRoles () {
      const orgId = this.currentOrganizationId
      const projectName = this.projectName

      this.loading = true
      let ifAllUser = false
      const resp = await getProjectRolesAPI({ orgId, productName: projectName })

      this.loading = false
      this.roles = resp.filter(element => {
        if (element.role.name === 'all-users') { // 如果有all-user
          ifAllUser = true
        }
        return element.roleId > 6
      })
      if (!ifAllUser) {
        const item = {
          id: 10,
          productName: null,
          type: 'all-users', // 用来区分第一次新建all-user角色
          role: { id: 10, name: 'all-users', roleType: null, productName: null, desc: null, isDisabled: false, updateBy: null, updatedAt: null }
        }
        this.roles.unshift(item)
      }
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.upsertRole()
        }
      })
    },
    async upsertRole () {
      const { name, roleType, permissionUUIDs } = this.form
      const productName = this.projectName
      const userName = this.$store.state.login.userinfo.info.name

      if (this.form.id === '') {
        const resp = await createRoleAPI({ name, updateBy: userName, productName })

        const { id: roleId } = resp

        await Promise.all([
          bindRoleToProjectAPI({ productName, roleId }),
          assignPermissionToRoleAPI({ productName, roleType, roleId, permissionUUIDs })
        ])

        this.$message({
          message: '创建角色成功',
          type: 'success'
        })
      } else {
        const roleId = this.form.id

        await Promise.all([
          updateRoleAPI({ productName, roleId, name, updateBy: userName }),
          assignPermissionToRoleAPI({ productName, roleType, roleId, permissionUUIDs })
        ])

        this.$message({
          message: '编辑角色成功',
          type: 'success'
        })
      }

      await this.getRoles()

      this.dialogRoleAddFormVisible = false
    },
    changeRoute (tab) {
      if (tab.name === 'member') {
        this.$router.push(`/v1/projects/detail/${this.projectName}/rbac/member`)
      } else if (tab.name === 'role') {
        this.$router.push(`/v1/projects/detail/${this.projectName}/rbac/role`)
      }
    }
  },
  computed: {
    currentOrganizationId () {
      return this.$store.state.login.userinfo.organization.id
    },
    projectName () {
      return this.$route.params.project_name
    },
    permissionGroups () {
      return permissions
    }
  },
  watch: {
    $route (to, from) {
      this.getRoles()
    }
  },
  created () {
    this.activeTab = 'role'
    this.getRoles()
    bus.$emit(`set-topbar-title`, { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: `/v1/projects/detail/${this.projectName}` }, { title: '角色管理', url: '' }] })
    bus.$emit(`set-sub-sidebar-title`, {
      title: this.projectName,
      url: `/v1/projects/detail/${this.projectName}`,
      routerList: [
        { name: '工作流', url: `/v1/projects/detail/${this.projectName}/pipelines` },
        { name: '集成环境', url: `/v1/projects/detail/${this.projectName}/envs` },
        { name: '服务', url: `/v1/projects/detail/${this.projectName}/services` },
        { name: '构建', url: `/v1/projects/detail/${this.projectName}/builds` },
        { name: '测试', url: `/v1/projects/detail/${this.projectName}/test` }]
    })
  }
}
</script>

<style lang="less">
.roles-container {
  position: relative;
  flex: 1;
  padding: 10px 20px;
  overflow: auto;
  font-size: 15px;

  .form {
    .el-form-item__label {
      line-height: 28px;
    }

    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }

      .el-form-item__content {
        line-height: 28px;
      }
    }

    .permissions-group {
      &:last-child {
        margin-bottom: 0;
      }

      .sub-permissions {
        margin-left: 25px;

        .sub-permissions-checkbox {
          min-width: ~"calc(25% - 30px)";
          font-weight: normal;
        }
      }
    }
  }

  .breadcrumb {
    .el-breadcrumb {
      font-size: 16px;
      line-height: 1.35;

      .el-breadcrumb__item__inner a:hover,
      .el-breadcrumb__item__inner:hover {
        color: #1989fa;
        cursor: pointer;
      }
    }
  }

  .tab-container {
    margin-top: 15px;

    .sync-container {
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
}
</style>
