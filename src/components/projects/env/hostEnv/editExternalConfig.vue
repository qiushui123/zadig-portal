<template>
  <div class="content">
    <div class="title">配置托管</div>
    <div class="step">
      <el-steps :active="currentStep" align-center finish-status="success">
        <el-step title="配置环境托管" description=""></el-step>
        <el-step title="配置服务构建" description=""></el-step>
        <el-step title="运行工作流" description=""></el-step>
      </el-steps>
    </div>
    <div class="currentStep">
      <div class="step">{{stepMap[activeStep].title}}</div>
      <span class="des">{{stepMap[activeStep].description}}</span>
      <component ref="component" :envName="$route.query.envName" :projectName="projectName" class="com" :is="componentsList[currentStep]" />
    </div>
    <div class="bottom"><div class="nextstep"  @click="nextStep">{{currentStep===2 ? '完成' : '下一步'}}</div><span class="des" @click="exit" v-if="currentStep===1">退出向导</span></div>
  </div>
</template>
<script>
import ServiceBuild from '@/components/projects/common/hosting/serviceBuild'
import EditHostService from './editHosService.vue'
import RunWorkflow from '@/components/projects/common/hosting/runWorkflow'

export default {
  name: 'editExteranlConfig',
  data () {
    return {
      componentsList: [EditHostService, ServiceBuild, RunWorkflow],
      activeStep: 0,
      stepMap: [{
        title: '第一步',
        description: '修改托管服务'
      }, {
        title: '第二步',
        description: '配置服务构建'
      }, {
        title: '第三步',
        description: '运行工作流'
      }]
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
  methods: {
    exit () {
      const envName = this.$route.query.envName
      this.$router.push(`/v1/projects/detail/${this.projectName}/envs/detail?envName=${envName}`)
    },
    nextStep () {
      const envName = this.$route.query.envName
      if (this.currentStep === 0) {
        this.$refs.component.submit(this.currentStep + 2)
      } else if (this.currentStep === 1) {
        console.log('123')
        this.$router.push(`/v1/projects/detail/${this.projectName}/envs/externalConfig?envName=${envName}&step=${this.currentStep + 2}`)
      } else {
        this.$router.push(`/v1/projects/detail/${this.projectName}/envs/detail?envName=${envName}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  width: 100%;

  .title {
    width: 110px;
    height: 30px;
    margin: 10px 0 10px 60px;
    padding: 5px;
    color: #fff;
    font-weight: 300;
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    background: #3289e4;
  }

  .step {
    width: 40%;
    margin-top: 40px;
  }

  .currentStep {
    margin: 0 0 10px 60px;

    .step {
      display: inline-block;
      width: 110px;
      height: 30px;
      padding: 5px;
      color: #fff;
      font-weight: 300;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      background: #3289e4;
    }

    .des {
      position: relative;
      left: 4px;
      display: inline-block;
      color: #4c4c4c;
      font-size: 13px;
    }
  }

  .com {
    height: calc(~"100vh - 440px");
    margin-top: 30px;
  }

  .bottom {
    position: fixed;
    bottom: 30px;
    z-index: 999;
    margin: 0 0 10px 60px;
    cursor: pointer;

    .nextstep {
      display: inline-block;
      width: 110px;
      height: 30px;
      padding: 5px;
      color: #fff;
      font-weight: 300;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
      background: #3289e4;
    }

    .des {
      position: relative;
      left: 6px;
      display: inline-block;
      color: #4c4c4c;
      font-size: 13px;
    }
  }
}
</style>
