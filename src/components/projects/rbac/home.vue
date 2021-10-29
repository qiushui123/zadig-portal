<template>
  <div class="project-home">
    <div class="tab-container" style="width: 100%;">
      <el-tabs  v-model="activeTab" :tab-position="tabPosition" type="card" style="height: 200px;">
        <el-tab-pane name="member" label="成员管理"><Member v-if="activeTab==='member'" :projectName="projectName" /></el-tab-pane>
        <el-tab-pane name="role" label="角色管理"><Role  v-if="activeTab==='role'" :projectName="projectName"/></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Member from './member.vue'
import Role from './role.vue'
import bus from '@utils/event_bus'

export default {
  name: 'rbac',
  components: {
    Member,
    Role
  },
  data () {
    return {
      activeTab: 'member',
      tabPosition: 'top'

    }
  },
  methods: {},
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  created () {
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

<style lang="less" scoped>
.project-home {
  padding: 25px 20px;
  font-size: 15px;
}
</style>
