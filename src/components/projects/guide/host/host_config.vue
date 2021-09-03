<template>
  <div class="container">
    <div>
    <Step :activeStep="currentStep" />
    <component ref="component" class="content" :is="componentsList[currentStep]" />
    </div>
    <div class="controls__wrap_host">
      <div class="controls__right">
        <button type="primary"
                  class="save-btn"
                  @click="nextStep"
                  plain>{{currentStep===2 ? '完成' : '下一步'}}</button>
        <button type="primary"
                class="save-btn"
                v-if="currentStep === 0"
                @click="jumpOnboarding">
          <i v-if="jumpLoading"
             class="el-icon-loading"></i>
          <span>跳过向导</span>
        </button>
        <div class="run-button">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import bus from '@utils/event_bus'
import Step from './components/step.vue'
import HostEnvConfig from './components/host_env_config.vue'
import ServiceBuild from './components/service_build.vue'
import RunWorkflow from './components/run_workflow.vue'

export default {
  name: 'hostConfig',
  components: {
    Step
  },
  data () {
    return {
      componentsList: [HostEnvConfig, ServiceBuild, RunWorkflow],
      jumpLoading: false
    }
  },
  methods: {
    jumpOnboarding () {
      this.jumpLoading = true
      this.saveOnboardingStatus(this.projectName, 0).then((res) => {
        this.$router.push(`/v1/projects/detail/${this.projectName}`)
      }).catch(() => {
        this.jumpLoading = false
      })
    },
    nextStep () {
      if (this.currentStep === 0) {
        this.$refs.component.nextStep(this.currentStep + 2)
      } else if (this.currentStep === 1) {
        this.$router.push(`/v1/projects/create/${this.projectName}/host/config?step=${this.currentStep + 2}`)
      } else {
        this.$router.push(`/v1/projects/detail/${this.projectName}`)
      }
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    },
    currentStep () {
      return this.$route.query.step - 1
    }
  },
  created () {
    bus.$emit('show-sidebar', true)
    bus.$emit('set-topbar-title', { title: '', breadcrumb: [{ title: '项目', url: '/v1/projects' }, { title: this.projectName, url: '' }] })
    bus.$emit('set-sub-sidebar-title', {
      title: '',
      routerList: []
    })
  }
}
</script>
<style lang="less" scoped>
.container {
  background-color: #f5f7f7;

  .content {
    height: calc(~"100vh - 340px");
    overflow: scroll;
  }

  .controls__wrap_host {
    position: fixed;
    bottom: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 60px;
    padding: 0 40px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
    & > * {
      margin-right: 10px;
    }

    .controls__right {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      align-items: center;
      -webkit-box-align: center;
      -ms-flex-align: center;

      .save-btn,
      .next-btn {
        margin-right: 15px;
        padding: 10px 17px;
        color: #fff;
        font-weight: bold;
        font-size: 13px;
        text-decoration: none;
        background-color: #1989fa;
        border: 1px solid #1989fa;
        cursor: pointer;
        transition: background-color 300ms, color 300ms, border 300ms;
      }

      .save-btn[disabled],
      .next-btn[disabled] {
        background-color: #9ac9f9;
        border: 1px solid #9ac9f9;
        cursor: not-allowed;
      }
    }
  }
}
</style>
