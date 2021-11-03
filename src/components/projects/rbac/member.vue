<template>
  <div>
    <el-alert type="info" :closable="false" description="项目成员管理，主要用于定义项目成员的角色"></el-alert>
    <div class="sync-container">
      <el-button plain size="small" type="primary" @click="$refs.addRoleBind.addUserFormVisible = true">添加成员</el-button>
    </div>

    <el-table v-loading="loading" row-key="id" :data="members" style="width: 100%;">
      <el-table-column label="用户名">
        <template slot-scope="scope">
          <span>{{scope.row.account}}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
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
          <span>{{scope.row.role}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="$utils.roleCheck().superAdmin"
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.name)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AddRoleBind :projectName="projectName" :getMembers="getRoleBindings" :rolesFiltered="rolesFiltered" ref="addRoleBind" />
  </div>
</template>
<script>
import bus from '@utils/event_bus'
import AddRoleBind from './addroleBind.vue'
import { queryRoleBindingsAPI, queryrole, queryPublicRole, deleteroleBindings } from '@/api'

export default {
  name: 'member',
  components: {
    AddRoleBind
  },
  props: {
    projectName: String
  },
  data () {
    return {
      members: [],
      rolesFiltered: [],
      loading: false
    }
  },
  methods: {
    async handleDelete (name) {
      this.$confirm('确定要删除这个绑定吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteroleBindings(name, this.projectName).then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getRoleBindings()
        })
      })
    },
    async getRoleBindings () {
      const res = await queryRoleBindingsAPI(this.projectName).catch(error =>
        console.log(error)
      )
      if (res) {
        this.members = res
      }
    },
    async getrole () {
      const res = await queryrole(this.projectName).catch(error =>
        console.log(error)
      )
      const res1 = await queryPublicRole().catch(error => console.log(error))
      if (res && res1) {
        this.rolesFiltered = res
        res1.forEach(item => {
          this.rolesFiltered.push({ name: item.name, isPublic: true })
        })
      }
    }
  },
  created () {
    this.getRoleBindings()
    this.getrole()
    bus.$emit(`set-topbar-title`, {
      title: '',
      breadcrumb: [
        { title: '项目', url: '/v1/projects' },
        {
          title: this.projectName,
          url: `/v1/projects/detail/${this.projectName}`
        },
        { title: '成员管理', url: '' }
      ]
    })
  }
}
</script>
<style lang="less" scoped>
.sync-container {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
