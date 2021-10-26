<template>
  <div class="dockerfile-template-container">
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
          name: 'Kubernetes 模板',
          url: `/v1/projects/template/dockerfiles`,
          icon: 'iconfont iconhelmrepo'
        }
      ]
    })
  }
}
</script>

<style lang="less" scoped>
.dockerfile-template-container {
  display: flex;
  height: 100%;
  overflow: hidden;
}
</style>
