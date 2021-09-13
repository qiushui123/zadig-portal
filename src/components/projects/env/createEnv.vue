<template>
    <component :is="currentComponents" />
</template>
<script>
import CreatHostEnv from './hostEnv/creatHostEnv.vue'
import CreatEnvDetail from './inner_env/create_env_detail.vue'
import { getSingleProjectAPI } from '@/api'

export default {
  name: 'createEnv',
  components: {
    CreatEnvDetail,
    CreatHostEnv
  },
  data () {
    return {
      currentComponents: null
    }
  },
  methods: {
    async checkProjectFeature () {
      const projectName = this.$route.params.project_name
      this.projectInfo = await getSingleProjectAPI(projectName)
      if (this.projectInfo.product_feature) {
        if (this.projectInfo.product_feature.create_env_type === 'external') {
          this.currentComponents = CreatHostEnv
        } else {
          this.currentComponents = CreatEnvDetail
        }
      }
    }
  },
  created () {
    this.checkProjectFeature()
  }
}
</script>
