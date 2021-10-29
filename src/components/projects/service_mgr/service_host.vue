<template>
  <div class="tab">
    <el-tabs type="card" :value="envName" @tab-click="tabChange">
      <el-tab-pane v-for="item in envNameList"  :key="item.env_name" :label="item.env_name" :name="item.env_name"></el-tab-pane>
    </el-tabs>
    <ServiceBuild v-if="envName" :envName="envName" :serviceName="serviceName" class="serviceBuild"/>
  </div>
</template>
<script>
import ServiceBuild from '@/components/projects/common/hosting/serviceBuild'
import { listProductAPI } from '@/api'
export default {
  name: 'service_host',
  components: {
    ServiceBuild
  },
  data () {
    return {
      envName: '',
      serviceName: null,
      envNameList: []
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  methods: {
    tabChange (tab) {
      this.envName = tab.name
    },
    async getEnvNameList () {
      const envNameList = await listProductAPI('', this.projectName)
      envNameList.forEach(element => {
        element.envName = element.env_name
      })
      this.envNameList = envNameList
    }
  },
  async created () {
    this.serviceName = this.$route.query.serviceName
    await this.getEnvNameList()
    if (this.$route.query.envName) {
      this.envName = this.$route.query.envName
    } else if (this.envNameList.length) {
      this.envName = this.envNameList[0].env_name
    }
  }
}
</script>
<style lang="less" scoped>
.tab {
  margin: 40px 10px;

  .serviceBuild {
    height: calc(~'100vh - 220px');
  }
}
</style>
