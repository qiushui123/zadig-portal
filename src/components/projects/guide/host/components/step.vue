<template>
  <div class="step-container1">
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
      <span class="first">{{stepMap[activeStep].title}}</span>
      <span class="second"
        >{{stepMap[activeStep].description}}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      stepMap: [{
        title: '第一步',
        description: '托管已有 K8s 集群资源，选择服务在 Zadig 中进行管理'
      }, {
        title: '第二步',
        description: '添加构建并配置相关脚本，后续可在工作流中自动更新服务'
      }, {
        title: '第三步',
        description: '运行工作流触发服务的自动化交付'
      }]
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
.step-container1 {
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
