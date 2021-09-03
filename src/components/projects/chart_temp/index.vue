<template>
  <div class="template-container">
    <router-view></router-view>
  </div>
</template>

<script>
import bus from '@utils/event_bus'
export default {
  created () {
    bus.$emit('set-sub-sidebar-title', {
      title: '模板库',
      routerList: [
        {
          name: 'Chart 模板',
          url: `/v1/chart/charts`
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
}
</style>
