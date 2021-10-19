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
            <el-button type="text" @click="usedChartNameInfo.yamlSource = 'gitRepo'" icon="el-icon-plus">添加 values 文件</el-button>
          </div>
          <ImportValues
            v-show="usedChartNameInfo.yamlSource !== 'default'"
            showDelete
            ref="importValuesRef"
            :resize="{direction: 'vertical'}"
            :importRepoInfo="usedChartNameInfo"
          ></ImportValues>
          <KeyValue ref="keyValueRef" :keyValues="usedChartNameInfo.overrideValues"></KeyValue>
        </div>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import { getChartValuesYamlAPI, getAllChartValuesYamlAPI } from '@api'
import { cloneDeep, pick } from 'lodash'

const chartInfoTemp = {
  envName: '', // ?: String
  serviceName: '', // : String
  chartVersion: '', // : String
  yamlSource: 'default', // : String
  overrideValues: [], // : Object{key,value}[]
  valuesYAML: '', // : String
  gitRepoConfig: null // : Object
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
    }
  },
  data () {
    return {
      allChartNameInfo: {}, // key: serviceName value: Object{ key:envName }
      selectedChart: '',
      selectedEnv: 'DEFAULT',
      disabledEnv: []
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
    switchTabs () {
      return this.$refs.importValuesRef && this.$refs.importValuesRef.validate()
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
          const yamlSource = chartInfo[envName].yamlSource
          chartInfo[envName].overrideValues = chartInfo[
            envName
          ].overrideValues.filter(value => value.key !== '')
          let values = pick(chartInfo[envName], [
            'envName',
            'serviceName',
            'chartVersion',
            'overrideValues'
          ])
          if (yamlSource === 'gitRepo') {
            values = {
              ...values,
              yamlSource,
              gitRepoConfig: cloneDeep(chartInfo[envName].gitRepoConfig)
            }
          } else if (yamlSource === 'freeEdit') {
            values = {
              ...values,
              yamlSource,
              valuesYAML: chartInfo[envName].valuesYAML
            }
          }
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
            envName
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
    }
  },
  components: {
    ImportValues,
    KeyValue
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
        .version-title {
          height: 40px;
          line-height: 40px;
        }

        .default-values {
          margin-bottom: 14px;
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
