<template>
  <div class="template-container">
    <router-view></router-view>
  </div>
</template>

<script>
import bus from '@utils/event_bus'
export default {
  created () {
    bus.$emit('set-topbar-title', { title: '模板库', breadcrumb: [] })
    bus.$emit('set-sub-sidebar-title', {
      title: '模板库',
      routerList: [
        {
          name: 'Chart',
          url: `/v1/projects/template/charts`,
          icon: 'iconfont iconhelmrepo'
        },
        {
          name: 'Dockerfile 模板库',
          url: `/v1/projects/template/dockerfiles`,
          icon: 'iconfont icondocker'
        },
        {
          name: 'K8s YAML 模板库',
          url: `/v1/projects/template/k8s-yamls`,
          icon: 'iconfont iconk8s'
        }
      ]
    })
  }
}
</script>

<style lang="less" scoped>
.template-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}
</style>
