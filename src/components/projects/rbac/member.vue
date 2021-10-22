<template>
  <div>
    <el-alert type="info" :closable="false" description="项目成员管理，主要用于定义项目成员的角色"></el-alert>
    <div class="sync-container">
      <el-button plain size="small" type="primary">添加成员</el-button>
    </div>

    <el-table v-loading="loading" row-key="id" :data="members" style="width: 100%;">
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
          <el-select v-model="scope.row.roleId" filterable size="small" placeholder="请输入角色名称进行搜索">
            <el-option v-for="item in rolesFiltered" :key="item.id" :label="item.role.name" :value="item.role.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="(scope.row.roleId !== ownerRoleId)|| $utils.roleCheck().superAdmin" size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import bus from '@utils/event_bus'

export default {
  name: 'member',
  props: {
    projectName: String
  },
  data () {
    return {
      members: [],
      loading: false
    }
  },
  created () {
    bus.$emit(`set-topbar-title`, { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: `/v1/projects/detail/${this.projectName}` }, { title: '成员管理', url: '' }] })
  }
}
</script>
<style lang="less" scoped>
.sync-container {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
