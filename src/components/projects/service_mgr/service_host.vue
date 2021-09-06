<template>
  <div class="tab">
    <el-tabs type="card" v-model="envName">
      <el-tab-pane v-for="item in envNameList" :key="item.env_name" :label="item.env_name" :name="item.env_name"></el-tab-pane>
    </el-tabs>
    <ServiceBuild :envName="envName" :serviceName="serviceName" class="serviceBuild"/>
  </div>
</template>
<script>
import ServiceBuild from '@/components/projects/common/hosting/serviceBuild'
import { mapGetters } from 'vuex'

export default {
  name: 'service_host',
  components: {
    ServiceBuild
  },
  data () {
    return {
      envName: null,
      serviceName: null
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    },
    envNameList () {
      return this.productList.filter(element => (element.product_name === this.projectName))
    },
    ...mapGetters([
      'productList', 'signupStatus'
    ])
  },
  async created () {
    if (this.$route.query.envName) {
      this.envName = this.$route.query.envName
    } else {
      this.envName = this.envNameList[0].env_name
    }
    this.serviceName = this.$route.query.serviceName
    await this.$store.dispatch('getProductListSSE').closeWhenDestroy(this)
  }
}
</script>
<style lang="less" scoped>
.tab {
  margin: 40px 10px;

  .serviceBuild {
    height: calc(~'100vh - 200px');
  }
}
</style>
