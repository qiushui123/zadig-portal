<template>
  <div class="loading-container">
    <div class="loading">
      <atom-spinner :animation-duration="1000"
                    :size="65"
                    color="#ff2968" />
    <div class="desc">
      服务启动中，请稍等片刻
    </div>
    </div>
        <footer>
      <div class="copyright">
        KodeRover © {{moment().format('YYYY')}}
        <el-tooltip>
          <div slot="content">
            <span v-if="processEnv.VERSION">Version: {{processEnv.VERSION}}</span><br>
            <span v-if="processEnv.BUILD_TIME">Build Time: {{moment.unix(processEnv.BUILD_TIME).format('YYYYMMDDHHmm')}}</span><br>
            <span v-if="processEnv.TAG">Tag: {{processEnv.TAG}}</span>
          </div>
          <span v-if="processEnv && processEnv.BUILD_TIME"
                class="el-icon-info"></span>
        </el-tooltip>
      </div>
    </footer>
  </div>
</template>

<script>
import { AtomSpinner } from 'epic-spinners'
import moment from 'moment'
export default {
  data () {
    return {
      moment
    }
  },
  computed: {
    processEnv () {
      return process.env
    }
  },
  components: {
    AtomSpinner
  }
}
</script>

<style lang="less" scoped>

.loading-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow-y: hidden;
  background: #fff;

  .loading {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80%;
    white-space: nowrap;

    .desc {
      margin-left: 20px;
      color: #2f3239;
      font-weight: 300;
      font-size: 18px;
      text-align: center;
    }
  }

  footer {
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    margin-bottom: 20px;
    text-align: center;

    .copyright {
      color: #606266;
      font-size: 13px;
    }
  }
}
</style>
