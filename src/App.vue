<template>
  <div style="
    display: flex;
    flex-direction: column;
    height: 100%;">
    <router-view style="height: 100%;">
    </router-view>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  methods: {
  },
  computed: {
    ...mapGetters([
      'signupStatus'
    ])
  },
  created () {
    this.$store.dispatch('getSignupStatus').then(() => {
      if (!this.signupStatus.inited) {
        this.$router.push('/setup')
      }
    }).catch(() => {
      this.$router.push('/loading')
    })
  }
}
</script>

<style lang="less">
@import url("~@assets/css/common/color.less");
@import url("~@assets/css/common/icon.less");

a {
  text-decoration: none;
}

body {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  font-family:
    "Overpass",
    "Noto Sans SC",
    -apple-system,
    BlinkMacSystemFont,
    "Helvetica Neue",
    Helvetica,
    Segoe UI,
    Arial,
    Roboto,
    "PingFang SC",
    "Hiragino Sans GB",
    "Microsoft Yahei",
    sans-serif;
  background-color: #fff;

  .el-card {
    background: #fff;
  }
}
</style>
