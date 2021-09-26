<template>
  <el-popover placement="right"
              trigger="hover">
    <div>
      <i class="iconfont iconrongqifuwu"></i> {{msg}}
    </div>
    <i class="el-icon-question"
       slot="reference"></i>
  </el-popover>
</template>

<script>
import { getSingleProjectAPI } from '@/api'

export default {
  data () {
    return {
      msg: '容器服务'
    }
  },
  methods: {
    async checkProjectFeature () {
      const projectName = this.$route.params.project_name
      const projectInfo = await getSingleProjectAPI(projectName)
      if (projectInfo.product_feature) {
        const productFeature = projectInfo.product_feature
        if (productFeature.deploy_type === 'k8s') {
          if (productFeature.basic_facility === 'cloud_host') {
            this.msg = '主机服务'
          }
        }
      }
    }
  },
  created () {
    this.checkProjectFeature()
  }
}
</script>
