<template>
  <div class="helm-chart-yaml-content">
    <el-tabs tab-position="left" type="border-card" v-model="selectedChart" :before-leave="switchTabs">
      <el-tab-pane :name="name.serviceName" v-for="name in serviceNames" :key="name.serviceName" :disabled="name.type==='delete'">
        <span slot="label">
          <i
            class="icon"
            :class="{'el-icon-delete': name.type==='delete', 'el-icon-refresh': name.type==='update', 'el-icon-folder-add': name.type==='create'}"
          ></i>
          <el-tooltip effect="dark" :content="name.serviceName" placement="left">
            <span class="desc">{{name.serviceName}}</span>
          </el-tooltip>
        </span>
      </el-tab-pane>
    </el-tabs>
    <div class="values" v-if="selectedChart && serviceNames.length" :class="{hidden: serviceNotHandle}">
      <div class="values-content">
        <el-tabs v-if="showEnvTabs" v-model="selectedEnv" :before-leave="switchTabs">
          <el-tab-pane :label="env" :name="env" v-for="env in envNames" :key="env" :disabled="disabledEnv.includes(env)"></el-tab-pane>
        </el-tabs>
        <div class="v-content" v-if="usedChartNameInfo">
          <div class="version-title">Chart Version: {{usedChartNameInfo.chartVersion}}</div>
          <div v-show="usedChartNameInfo.yamlSource === 'default'" class="default-values">
            <el-button type="text" @click="usedChartNameInfo.yamlSource = 'freeEdit'" icon="el-icon-plus">添加 values 文件</el-button>
          </div>
          <ImportValues
            v-show="usedChartNameInfo.yamlSource !== 'default'"
            showDelete
            ref="importValuesRef"
            :resize="{direction: 'vertical'}"
            :importRepoInfo="usedChartNameInfo"
          ></ImportValues>
          <KeyValue ref="keyValueRef" :keyValues="usedChartNameInfo.overrideValues" :listKeyValues="listKeyValues"></KeyValue>
          <section class="review-content">
            <el-button type="text" @click="getReviewValuesFile">
              预览最终 values 文件
              <i style="margin-left: 8px;" :class="{'el-icon-arrow-down': showReview, 'el-icon-arrow-right': !showReview}"></i>
            </el-button>
            <Codemirror class="codemirror" ref="codemirror" v-if="showReview" :value="usedChartNameInfo.yamlContent" :cmOption="cmOption"></Codemirror>
          </section>
        </div>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import Codemirror from '@/components/projects/common/codemirror.vue'
import {
  getChartValuesYamlAPI,
  getAllChartValuesYamlAPI,
  getCalculatedValuesYamlAPI,
  getEnvDefaultVariableAPI
} from '@api'
import { cloneDeep, pick } from 'lodash'

const chartInfoTemp = {
  envName: '', // ?: String
  serviceName: '', // : String
  chartVersion: '', // : String
  yamlSource: 'default', // : String
  overrideValues: [], // : Object{key,value}[]
  overrideYaml: '', // : String
  gitRepoConfig: null, // : Object [Not use, just record]
  yamlContent: '' // 预览 YAML 内容
}

// const allChartNameInfoTemp = {
//   serviceName: {
//     envName: chartInfoTemp
//   }
// }

export default {
  name: 'ChartValues',
  props: {
    chartNames: {
      type: Array, // Object{serviceName}[]
      required: false,
      default: () => null
    },
    envNames: {
      // 环境列表
      type: Array,
      required: false,
      default: () => []
    },
    handledEnv: {
      // 正在处理的环境名称
      type: String,
      required: false
    },
    showEnvTabs: {
      // 是否展示环境tab
      default: false,
      type: Boolean,
      required: false
    },
    getEnvChart: {
      default: false,
      type: Boolean
    },
    defaultEnvValue: {
      type: Object,
      default: () => {
        return {
          envName: '',
          defaultValues: ''
        }
      }
    }
  },
  data () {
    this.cmOption = {
      readOnly: 'nocursor',
      lineNumbers: false
    }
    this.defaultEnvsValues = {} // 不需要响应式 { key: envName, value: defaultEnvValue }
    return {
      allChartNameInfo: {}, // key: serviceName value: Object{ key:envName }
      selectedChart: '',
      selectedEnv: 'DEFAULT',
      disabledEnv: [],
      showReview: false,
      listKeyValues: {}
    }
  },
  computed: {
    serviceNames () {
      return (
        this.chartNames ||
        Object.keys(this.allChartNameInfo).map(name => {
          return { serviceName: name, type: 'common' }
        })
      )
    },
    projectName () {
      return this.$route.params.project_name
    },
    usedChartNameInfo () {
      const selectedEnv = this.handledEnv || this.selectedEnv
      return (
        (this.allChartNameInfo[this.selectedChart] &&
          this.allChartNameInfo[this.selectedChart][selectedEnv]) ||
        cloneDeep(chartInfoTemp)
      )
    },
    serviceNotHandle () {
      return (
        this.serviceNames.find(
          service => service.serviceName === this.selectedChart
        ).type === 'delete' ||
        (this.showEnvTabs && this.selectedEnv === 'DEFAULT')
      )
    }
  },
  methods: {
    async getEnvDefaultVariable (envName) {
      if (
        Object.prototype.hasOwnProperty.call(this.defaultEnvsValues, envName) ||
        envName === 'DEFAULT'
      ) {
        return
      }
      const res = await getEnvDefaultVariableAPI(
        this.projectName,
        envName
      ).catch(error => console.log(error))
      if (res) {
        this.defaultEnvsValues[envName] = res.defaultValues
      }
    },
    async getCalculatedValuesYaml (kvFlag = true) {
      const envName = this.handledEnv || this.selectedEnv
      const format = kvFlag ? 'flatMap' : 'yaml'

      await this.getEnvDefaultVariable(envName)

      const payload = {
        defaultValues: this.defaultEnvsValues[envName] || '',
        overrideYaml:
          this.usedChartNameInfo.yamlSource === 'default'
            ? ''
            : this.usedChartNameInfo.overrideYaml
      }
      if (!kvFlag) {
        payload.overrideValues = this.usedChartNameInfo.overrideValues
      }
      const res = await getCalculatedValuesYamlAPI(
        this.projectName,
        this.selectedChart,
        envName === 'DEFAULT' ? '' : envName,
        format,
        payload
      ).catch(error => {
        console.log(error)
      })
      if (res) {
        if (kvFlag) {
          this.listKeyValues = res
        } else {
          this.usedChartNameInfo.yamlContent = res.yamlContent
        }
      }
    },
    getReviewValuesFile () {
      this.showReview = !this.showReview
      if (this.showReview) this.getCalculatedValuesYaml(false)
    },
    switchTabs () {
      const valid =
        this.$refs.importValuesRef && this.$refs.importValuesRef.validate()
      if (valid) this.showReview = false
      return valid
    },
    getAllChartNameInfo () {
      const chartValues = []
      const serviceNames = this.serviceNames.map(chart => chart.serviceName)
      const chartNameInfo = this.allChartNameInfo
      const envNames = this.envNames.length ? this.envNames : ['DEFAULT']
      for (const serviceName in chartNameInfo) {
        if (!serviceNames.includes(serviceName)) {
          continue
        }
        const chartInfo = chartNameInfo[serviceName]
        for (const envName in chartInfo) {
          if (!envNames.includes(envName)) {
            continue
          }
          chartInfo[envName].overrideValues = chartInfo[
            envName
          ].overrideValues.filter(value => value.key !== '')
          const values = pick(chartInfo[envName], [
            'envName',
            'serviceName',
            'chartVersion',
            'overrideValues'
          ])
          values.overrideYaml =
            chartInfo[envName].yamlSource !== 'default'
              ? chartInfo[envName].overrideYaml
              : ''
          chartValues.push(values)
        }
      }
      return chartValues
    },
    resetAllChartNameInfo () {
      this.allChartNameInfo = {}
    },
    initAllChartNameInfo (envName = 'DEFAULT') {
      if (!this.chartNames) {
        return
      }
      this.chartNames.forEach(chart => {
        const envInfos = {}
        envInfos[envName] = {
          ...cloneDeep(chartInfoTemp),
          ...chart,
          envName: envName === 'DEFAULT' ? '' : envName
        }
        this.$set(this.allChartNameInfo, chart.serviceName, {
          ...this.allChartNameInfo[chart.serviceName],
          ...envInfos
        })
      })
      this.selectedChart = Object.keys(this.allChartNameInfo)[0]
    },
    validate () {
      const valid = []
      if (this.$refs.importValuesRef) {
        valid.push(this.$refs.importValuesRef.validate())
      }
      if (this.$refs.keyValueRef) valid.push(this.$refs.keyValueRef.validate())
      return Promise.all(valid)
    },
    async getChartValuesYaml ({ envName }) {
      const fn = this.getEnvChart
        ? getChartValuesYamlAPI
        : getAllChartValuesYamlAPI
      const serviceNames = this.chartNames
        ? this.chartNames.map(chart => chart.serviceName)
        : []
      const res = await fn(this.projectName, envName, serviceNames).catch(
        err => {
          this.disabledEnv.push(envName)
          console.log(err)
        }
      )
      if (res) {
        if (this.disabledEnv.includes(envName)) {
          const id = this.disabledEnv.indexOf(envName)
          this.disabledEnv.splice(id, 1)
        }

        res.forEach(re => {
          const envInfo = {
            ...cloneDeep(chartInfoTemp),
            ...re,
            envName,
            yamlSource: re.overrideYaml ? 'freeEdit' : 'default'
          }

          const allChartNameInfo = {}

          allChartNameInfo[re.serviceName] = {
            ...this.allChartNameInfo[re.serviceName]
          }
          allChartNameInfo[re.serviceName][envName] = envInfo

          this.$set(
            this.allChartNameInfo,
            re.serviceName,
            allChartNameInfo[re.serviceName]
          )
        })
        this.selectedChart = Object.keys(this.allChartNameInfo)[0]
      }
    }
  },
  watch: {
    envNames: {
      handler (newV, oldV) {
        if (newV) {
          const envNamesByGet = oldV
            ? newV.filter(nv => {
              return !oldV.includes(nv)
            })
            : newV
          this.selectedEnv = newV[newV.length - 1] || 'DEFAULT'
          envNamesByGet.forEach(env => {
            if (env === 'DEFAULT' || !env) {
              return
            }
            this.getChartValuesYaml({ envName: env })
          })
        }
      },
      immediate: true
    },
    handledEnv: {
      handler (newV, oldV) {
        if (newV && !this.envNames.includes(newV)) {
          this.getChartValuesYaml({ envName: newV })
        }
      },
      immediate: true
    },
    chartNames: {
      handler (newV, oldV) {
        if (newV) {
          this.initAllChartNameInfo()
        }
      },
      immediate: true
    },
    defaultEnvValue: {
      handler (newV, oldV) {
        if (newV && newV.envName) {
          this.defaultEnvsValues[newV.envName] = newV.defaultValues
        }
      },
      immediate: true
    }
  },
  components: {
    ImportValues,
    KeyValue,
    Codemirror
  }
}
</script>

<style lang="less" scoped>
.helm-chart-yaml-content {
  display: flex;
  box-sizing: border-box;
  width: 100%;

  /deep/.el-tabs {
    flex-shrink: 0;

    .el-tabs__header {
      margin-right: 0;

      &.is-left {
        .el-tabs__item {
          width: 150px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;

          .icon {
            display: inline-block;
            padding-right: 3px;
          }
        }
      }

      &.is-top {
        margin-bottom: 5px;
      }
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .values {
    position: relative;
    box-sizing: border-box;
    width: calc(~'100% - 160px');
    padding: 0 20px;
    border: 1px solid #dcdfe6;
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    .values-content {
      position: relative;
      z-index: 0;

      .v-content {
        padding-bottom: 10px;

        .version-title {
          height: 40px;
          line-height: 40px;
        }

        .default-values {
          margin-bottom: 14px;
        }
      }

      .review-content {
        margin-top: 20px;

        .codemirror {
          height: 200px;
          padding: 5px;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
        }
      }
    }

    &.hidden {
      .mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        background-color: rgba(255, 255, 255, 0.5);
        cursor: not-allowed;
      }
    }
  }
}
</style>
