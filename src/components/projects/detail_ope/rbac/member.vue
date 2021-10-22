<template>

    <div class="roles-container">
      <el-dialog class="form"
                 title="添加成员"
                 width="550px"
                 :visible.sync="addUserFormVisible">
        <el-form :model="form"
                 ref="form"
                 :rules="formRules"
                 label-width="100px">
          <el-form-item label="用户名称"
                        prop="uids">
            <el-select class="select"
                       v-model="form.uids"
                       filterable
                       multiple
                       remote
                       :remote-method="remoteMethod"
                       :loading="getUsersLoading"
                       size="small"
                       placeholder="请输入用户名称进行搜索">
              <el-option v-for="user in users"
                         :key="user.id"
                         :label="user.email?`${user.name}(${user.email})`:`${user.name}`"
                         :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色名称"
                        prop="roleId">
            <el-select class="select"
                       v-model="form.roleId"
                       filterable
                       size="small"
                       placeholder="请输入角色名称进行搜索">
              <el-option v-for="item in rolesFiltered"
                         :key="item.id"
                         :label="item.role.name"
                         :value="item.role.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer"
             class="dialog-footer">
          <el-button size="small"
                     @click="addUserFormVisible = false">取 消</el-button>
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
            <el-alert type="info"
                      :closable="false"
                      description="项目成员管理，主要用于定义项目成员的角色">
            </el-alert>

            <div class="sync-container">
              <el-button plain
                         size="small"
                         @click="handleAdd()"
                         type="primary">添加成员</el-button>
            </div>

            <el-table v-loading="loading"
                      row-key="id"
                      :data="members"
                      style="width: 100%;">
              <el-table-column label="用户名称">
                <template slot-scope="scope">
                  <span>{{scope.row.username}}</span>
                </template>
              </el-table-column>
              <el-table-column label="邮件">
                <template slot-scope="scope">
                  <span>{{scope.row.email}}</span>
                </template>
              </el-table-column>
              <el-table-column label="角色">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.roleId"
                             filterable
                             size="small"
                             placeholder="请输入角色名称进行搜索"
                             @focus="cacheMemberRole({uid: scope.row.id, roleId: scope.row.roleId})"
                             @change="updateMemberRole(scope.row)">
                    <el-option v-for="item in rolesFiltered"
                               :key="item.id"
                               :label="item.role.name"
                               :value="item.role.id">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button v-if="(scope.row.roleId !== ownerRoleId)|| $utils.roleCheck().superAdmin"
                             size="mini"
                             type="danger"
                             @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>

              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="role"
                       label="角色管理">
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import { getProjectRolesAPI, getMembersFromRoleAPI, usersAPI, deleteMemberFromRoleAPI, addMembersToRoleAPI } from '@api'
import _ from 'lodash'
import bus from '@utils/event_bus'
const initFormData = {
  uids: [],
  roleId: undefined
}

export default {
  data () {
    return {
      ownerRoleId: 3,
      tabPosition: 'top',
      members: [],
      users: [],
      getUsersLoading: false,
      roles: [],
      rolesFiltered: [],
      cachedMemberData: null,
      form: _.cloneDeep(initFormData),
      formRules: {
        uids: [
          { type: 'array', required: true, message: '请选择用户', trigger: 'change' }
        ],
        roleId: [
          { type: 'number', required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      loading: true,
      activeTab: '',
      addUserFormVisible: false
    }
  },
  methods: {
    async handleDelete (index, row) {
      try {
        await this.$confirm('确定删除这个成员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        const productName = this.projectName
        const roleId = row.roleId

        await deleteMemberFromRoleAPI({
          roleId,
          productName,
          userId: row.id
        })

        this.$message({
          message: '删除成员成功',
          type: 'success'
        })

        await this.getMembers()
      } catch (e) { }
    },
    handleAdd () {
      this.initNewForm()
      this.addUserFormVisible = true

      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    initNewForm () {
      this.form = _.cloneDeep(initFormData)
    },
    async getMembers () {
      const orgId = this.currentOrganizationId
      const projectName = this.projectName

      this.loading = true

      const resp = await getProjectRolesAPI({ orgId, productName: projectName })
      const roleIds = resp.map(item => item.roleId)

      const roleDetailsFiltered = resp.filter(item => item.roleId > 6)

      const roleMemberPromises = roleIds.map(roleId => {
        return getMembersFromRoleAPI({ roleId, productName: projectName })
      })
      const roleMembers = await Promise.all(roleMemberPromises)
      const roleMembersFlatten = _.flatten(roleMembers)

      const projectMembers = roleMembersFlatten.map(roleUser => {
        const { roleId, userId, username, email } = roleUser
        return {
          id: userId,
          username,
          roleId,
          email
        }
      })

      this.loading = false
      const filterMembers = projectMembers.map(element => {
        return element.roleId > 6
      })
      this.members = _.sortBy(filterMembers, 'name')
      this.roles = _.sortBy(resp, 'id')
      this.rolesFiltered = _.sortBy(roleDetailsFiltered, 'id')
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addMember()
        }
      })
    },
    async addMember () {
      const { uids, roleId } = this.form
      const productName = this.projectName
      const newUserIds = this.members.filter(item => item.roleId === roleId).map(item => item.id).concat(uids)

      await addMembersToRoleAPI({ roleId, productName, userIds: newUserIds })

      this.$message({
        message: '添加成员成功',
        type: 'success'
      })

      await this.getMembers()

      this.addUserFormVisible = false
    },
    cacheMemberRole (oldMemberData) {
      this.cachedMemberData = oldMemberData
    },
    async updateMemberRole (member) {
      const oldRoleId = this.cachedMemberData.roleId
      const { roleId: newRoleId } = member
      const productName = this.projectName

      try {
        await deleteMemberFromRoleAPI({
          roleId: oldRoleId,
          productName,
          userId: member.id
        })

        const newUserIds = this.members.filter(item => item.roleId === newRoleId).map(item => item.id)

        await addMembersToRoleAPI({
          roleId: newRoleId,
          productName,
          userIds: newUserIds
        })

        this.cachedMemberData.roleId = newRoleId

        this.$message({
          message: '角色更新成功',
          type: 'success'
        })
      } catch (e) {
        member.roleId = oldRoleId

        this.$message.error('角色更新失败')

        throw e
      }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        const orgId = this.currentOrganizationId
        usersAPI(orgId, '', 0, 0, query).then((res) => {
          this.loading = false
          this.users = (_.uniqBy(res.data, 'id')).reverse()
        })
      } else {
        this.users = []
      }
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
    }
  },
  watch: {
    $route (to, from) {
      this.getMembers()
    }
  },
  created () {
    this.activeTab = 'member'
    this.getMembers()
    bus.$emit(`set-topbar-title`, { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: `/v1/projects/detail/${this.projectName}` }, { title: '成员管理', url: '' }] })
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
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }

      .select {
        width: 100%;
      }
    }
  }

  .breadcrumb {
    margin-bottom: 25px;

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
