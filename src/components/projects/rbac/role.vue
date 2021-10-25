<template>
  <div>
    <el-alert type="info" :closable="false" description="项目成员管理，主要用于定义项目成员的角色"></el-alert>
    <div class="sync-container">
      <el-button plain size="small" @click="$refs['addrole'].dialogRoleAddFormVisible = true" type="primary">添加角色</el-button>
    </div>

    <el-table v-loading="loading" row-key="id" :data="roles" style="width: 100%;">
      <el-table-column label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="修改人">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleId" filterable size="small" placeholder="请输入角色名称进行搜索">
            <el-option v-for="item in rolesFiltered" :key="item.id" :label="item.role.name" :value="item.role.id"></el-option>
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deleterole(scope.row.name)"  size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Addrole :projectName="projectName" :getrole="getrole" ref="addrole" />
  </div>
</template>
<script>
import bus from '@utils/event_bus'
import Addrole from './addrole.vue'
import { queryrole, deleterole } from '@/api'

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
      loading: false
    }
  },
  methods: {
    async getrole () {
      this.loading = true
      const res = await queryrole(this.projectName).catch(error => console.log(error))
      if (res) {
        this.roles = res
      }
      this.loading = false
    },
    async deleterole (name) {
      const res = await deleterole(name, this.projectName).catch(error => console.log(error))
      if (res) {
        this.$confirm('确认删除此角色？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message.success('删除成功')
          this.getrole()
        })
      }
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
