<template>
  <div>
    <el-alert type="info" :closable="false" description="项目角色管理，主要用于定义项目的角色"></el-alert>
    <div class="sync-container">
      <el-button plain size="small" @click="addrole" type="primary">添加角色</el-button>
    </div>

    <el-table v-loading="loading" row-key="id" :data="roles" style="width: 100%;">
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色类型">
        <template slot-scope="scope">
          <span>{{scope.row.isPublic ? '公共角色': '私有角色'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editrole(scope.row)" v-if="scope.row.name !== 'admin' || !scope.row.isPublic"  size="mini" type="primary">编辑</el-button>
          <el-button @click="deleterole(scope.row)"  v-if="scope.row.name !== 'admin' || !scope.row.isPublic"  size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Addrole :projectName="projectName" :currentRole="currentRole" :getrole="getrole" ref="addrole" />
  </div>
</template>
<script>
import bus from '@utils/event_bus'
import Addrole from './addrole.vue'
import { queryrole, deleterole, queryPublicRole, deletePublicRole } from '@/api'

export default {
  name: 'member',
  components: {
    Addrole
  },
  props: {
    projectName: String
  },
  data () {
    return {
      roles: [],
      loading: false,
      currentRole: null
    }
  },
  methods: {
    editrole (role) {
      this.currentRole = role
      this.$refs.addrole.dialogRoleAddFormVisible = true
    },
    addrole (role) {
      this.currentRole = null
      this.$refs.addrole.dialogRoleAddFormVisible = true
    },
    async getrole () {
      this.loading = true
      const res = await queryrole(this.projectName).catch(error => console.log(error))
      const res1 = await queryPublicRole().catch(error => console.log(error))
      if (res && res1) {
        this.roles = res
        res1.forEach(item => {
          this.roles.push({ name: item.name, isPublic: true })
        })
      }
      this.loading = false
    },
    async deleterole (row) {
      this.$confirm('此角色的成员权限也会被删除，请谨慎操作', '确认删除此角色?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let res = null
        if (row.isPublic) {
          res = await deletePublicRole(row.name).catch(error => console.log(error))
        } else {
          res = await deleterole(row.name, this.projectName).catch(error => console.log(error))
        }
        if (res) {
          this.$message.success('删除成功')
          this.getrole()
        }
      })
    }
  },
  created () {
    this.getrole()
    bus.$emit(`set-topbar-title`, { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: `/v1/projects/detail/${this.projectName}` }, { title: '角色管理', url: '' }] })
  }
}
</script>
<style lang="less" scoped>
.sync-container {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
