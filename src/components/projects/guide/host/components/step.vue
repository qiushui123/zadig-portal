<template>
  <div class="step-container">
    <div class="step-detail">
      <div class="guide-title">
        <h4>
          产品交付向导
        </h4>
      </div>
      <el-steps :active="activeStep"
                class="process-container"
                align-center
                finish-status="success">
        <el-step title="配置环境托管"
                 description=""></el-step>
        <el-step title="配置服务构建"
                 description=""></el-step>
        <el-step title="运行工作流"
                 description=""></el-step>
      </el-steps>
    </div>
    <div class="title-container">
      <span class="first">第一步</span>
      <span class="second"
        >托管现有环境，后续托管其他测试环境，可以在集成环境模块操作</span
      >
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  props: {
    activeStep: {
      required: true,
      type: Number
    }
  }
}
</script>
<style lang="less">
.step-container {
  height: 200px;
  padding-top: 20px;
  padding-left: 20px;

  .title-container {
    margin-bottom: 10px;
    margin-left: 20px;
    padding-top: 40px;

    .first {
      display: inline-block;
      width: 110px;
      padding: 8px;
      color: #fff;
      font-weight: 300;
      font-size: 18px;
      text-align: center;
      background: #3289e4;
    }

    .second {
      display: inline-block;
      color: #4c4c4c;
      font-size: 13px;
    }
  }

  .step-detail {
    width: 80%;

    .guide-title {
      display: flex;

      h4 {
        width: 110px;
        margin: 0 0 10px 20px;
        padding: 8px;
        color: #fff;
        font-weight: 300;
        font-size: 18px;
        text-align: center;
        background: #3289e4;
      }
    }

    .process-container {
      margin-top: 10px;
    }
  }
}
</style>
