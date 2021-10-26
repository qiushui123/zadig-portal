<template>
  <el-collapse class="helm-env-template" v-model="activeName" @change="collapseChange" accordion>
    <el-collapse-item title="默认环境变量" name="env">
      <EnvValues
        ref="envValuesRef"
        :envName="handledEnv"
        @envYaml="saveEnvYaml"
        :overrideYaml="defaultEnvValue && defaultEnvValue.defaultValues"
      ></EnvValues>
    </el-collapse-item>
    <el-collapse-item :title="`${serviceVariableTitle}变量`" name="service">
      <ChartValues
        ref="chartValuesRef"
        :chartNames="chartNames"
        :envNames="envNames"
        :handledEnv="handledEnv"
        :envScene="envScene"
        :showEnvTabs="showEnvTabs"
        :defaultEnvValue="defaultEnvValue"
      ></ChartValues>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import EnvValues from '../common/updateHelmEnvVariable.vue'
import ChartValues from '../common/updateHelmEnvChart.vue'
export default {
  name: 'HelmEnvTemplate',
  data () {
    return {
      activeName: 'service',
      defaultEnvsValues: {} // { key: envName, value: defaultEnvValue }
    }
  },
  props: {
    chartNames: {
      type: Array, // Object{serviceName}[]
      required: false,
      default: () => null
    },
    envNames: {
      type: Array,
      required: false,
      default: () => []
    },
    handledEnv: {
      // 正在处理的环境名称
      type: String,
      required: false,
      default: ''
    },
    showEnvTabs: {
      /**
       * 是否展示具体服务信息的环境tab
       */
      default: false,
      type: Boolean
    },
    envScene: {
      type: String,
      required: true
    },
    serviceVariableTitle: {
      required: false,
      type: String,
      default: '服务'
    }
  },
  computed: {
    defaultEnvValue () {
      const envName = this.handledEnv || 'DEFAULT'
      return {
        envName,
        defaultValues: this.defaultEnvsValues[envName]
      }
    }
  },
  methods: {
    saveEnvYaml (data) {
      const envName = data.envName || 'DEFAULT'
      this.$set(this.defaultEnvsValues, envName, data.defaultValues)
    },
    validate () {
      const valid = []
      valid.push(this.$refs.envValuesRef.validate())
      valid.push(this.$refs.chartValuesRef.validate())
      return Promise.all(valid)
    },
    collapseChange (activeName) {
      this.validate()
        .catch(() => {
          this.activeName = activeName === 'env' ? 'service' : 'env'
        })
        .then(() => {
          this.$refs.chartValuesRef.closeReview()
        })
    },
    getAllInfo () {
      return {
        envInfo: this.defaultEnvsValues,
        chartInfo: this.$refs.chartValuesRef.getAllChartNameInfo()
      }
    }
  },
  components: {
    EnvValues,
    ChartValues
  },
  created () {
    this.envNames.forEach(env => {
      this.$set(this.defaultEnvsValues, env, '')
    })
  }
}
</script>

<style lang="less" scoped>
.helm-env-template {
  margin-top: -1px;

  /deep/.el-collapse-item {
    .el-collapse-item__header {
      padding-left: 8px;
    }

    .el-collapse-item__wrap {
      border-bottom-width: 0;

      .el-collapse-item__content {
        padding-bottom: 10px;
        padding-left: 8px;
        line-height: inherit;
      }
    }
  }
}
</style>
