<template>
  <div class="container-home"
       v-loading="loading"
       element-loading-text="加载中..."
       element-loading-spinner="iconfont iconfont-loading iconrongqi">
    <div v-if="loading || emptyEnvs"
         class="no-show">
      <img src="@assets/icons/illustration/environment.svg"
           alt="" />
      <p v-if="emptyEnvs">暂无环境，请到项目中创建环境！</p>
    </div>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bus from '@utils/event_bus'
export default {
  data () {
    return {
      loading: true,
      firstJumpPath: '',
      emptyEnvs: false
    }
  },
  computed: {
    ...mapGetters([
      'productList'
    ]),
    isInProject () {
      return this.$route.path.includes('/projects/detail/')
    }
  },
  watch: {
    productList: {
      immediate: true,
      handler () {
        this.getProducts()
      }
    }
  },
  methods: {
    async getProducts () {
      const projectList = this.productList.filter(product => {
        return !product.onboard && product.envs.length
      })
      const routerList = projectList.map(element => {
        return { name: element.name, url: `/v1/envs/detail/${element.name}?envName=${element.envs[0]}` }
      })
      bus.$emit('set-sub-sidebar-title', {
        title: '项目列表',
        routerList: routerList
      })
      this.loading = false
      if (this.productList.length === 0) {
        this.emptyEnvs = true
        return
      } else {
        this.emptyEnvs = false
      }
      this.firstJumpPath = `/v1/envs/detail/${projectList[0].name}?envName=${projectList[0].envs[0]}`
      if (!this.$route.params.project_name) {
        this.$router.push(this.firstJumpPath)
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (!this.firstJumpPath) {
      next()
    } else if (to.path === '/v1/envs' || !to.params.project_name) {
      next(this.firstJumpPath)
    } else {
      next()
    }
  },
  mounted () {
    bus.$emit('set-topbar-title', { title: '集成环境', breadcrumb: [] })
  }
}
</script>

<style lang="less" >
.container-home {
  position: relative;
  display: flex;
  flex: 1;
  padding: 15px 20px;
  overflow: hidden;

  .no-show {
    margin: auto;

    img {
      width: 460px;
      height: 460px;
    }

    p {
      color: #8d9199;
      font-size: 15px;
      text-align: center;
    }
  }
}
</style>
