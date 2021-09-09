<template>
  <div class="content">
    <div class="title">配置托管</div>
    <div class="step">
      <el-steps
        :active="activeStep"
        align-center
        finish-status="success"
      >
        <el-step title="配置环境托管" description=""></el-step>
        <el-step title="配置服务构建" description=""></el-step>
        <el-step title="运行工作流" description=""></el-step>
      </el-steps>
    </div>
    <div class="currentStep">
        <div class="step" >第一步</div>
        <span>修改托管服务</span>
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
export default {
  name: 'editExteranlConfig',
  data () {
    return {
      activeStep: 0
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  width: 100%;
  padding: 20px;

  .title {
    width: 110px;
    margin: 0 0 10px 60px;
    padding: 8px;
    color: #fff;
    font-weight: 300;
    font-size: 18px;
    text-align: center;
    background: #3289e4;
  }

  .step {
    width: 40%;
    margin-top: 40px;
  }

  .currentStep {

    .step {

    }
  }
}

</style>
