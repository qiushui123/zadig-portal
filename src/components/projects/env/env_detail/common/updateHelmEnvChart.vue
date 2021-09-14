<template>
  <div class="helm-chart-yaml-content">
    <el-tabs tab-position="left" type="border-card" v-model="checkedChart">
      <el-tab-pane :name="name.serviceName" v-for="name in serviceNames" :key="name.serviceName" :disabled="name.serviceName==='delete'">
        <span slot="label">
          <i
            class="icon"
            :class="{'el-icon-delete': name.type==='delete', 'el-icon-refresh': name.type==='update', 'el-icon-folder-add': name.type==='create'}"
          ></i>
          <span class="desc">{{name.serviceName}}</span>
        </span>
      </el-tab-pane>
    </el-tabs>
    <div class="values" v-if="checkedChart && serviceNames.length">
      <el-tabs v-if="Array.isArray(envNames)" v-model="selectedEnv">
        <el-tab-pane :label="env" :name="env" v-for="env in envNames" :key="env"></el-tab-pane>
      </el-tabs>
      <div class="content">
        <div class="title">Chart Version: {{usedChartNameInfo.chartVersion}}</div>
        <div v-show="usedChartNameInfo.yamlSource === 'default'" class="default-values">
          <div class="desc">暂无自定义的 values 文件</div>
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
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import { getAllChartValuesYamlAPI } from '@api'
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
      /**
       * Array: 展示环境 tab
       * String: 不展示环境 tab
       */
      type: [Array, String],
      required: true
    }
  },
  data () {
    return {
      allChartNameInfo: {}, // key: serviceName value: Object{ key:envName }
      checkedChart: '',
      selectedEnv: 'DEFAULT'
    }
  },
  computed: {
    serviceNames () {
      console.log('update')
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
      return this.allChartNameInfo[this.checkedChart][this.selectedEnv]
    }
  },
  methods: {
    getAllChartNameInfo () {
      const chartValues = []
      const serviceNames = this.serviceNames.map(chart => chart.serviceName)
      const chartNameInfo = this.allChartNameInfo
      const envNames = Array.isArray(this.envNames)
        ? this.envNames
        : [this.envNames]
      for (const serviceName in chartNameInfo) {
        if (!serviceNames.includes(serviceName)) {
          continue
        }
        const chartInfo = chartNameInfo[serviceName]
        for (const envName in chartInfo) {
          if (!envNames.includes(envName)) {
            continue
          }
          let values = pick(chartInfo[envName], [
            'envName',
            'serviceName',
            'chartVersion',
            'yamlSource',
            'overrideValues'
          ])
          if (values.yamlSource === 'gitRepo') {
            values = {
              ...values,
              gitRepoConfig: cloneDeep(chartInfo[envName].gitRepoConfig)
            }
          } else if (values.yamlSource === 'freeEdit') {
            values = { ...values, valuesYAML: chartInfo[envName].valuesYAML }
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
      this.checkedChart = Object.keys(this.allChartNameInfo)[0]
    },
    validate () {
      const valid = []
      if (this.$refs.importValuesRef) {
        valid.push(this.$refs.importValuesRef.validate())
      }
      if (this.$refs.keyValueRef) valid.push(this.$refs.keyValueRef.validate())
      return Promise.all(valid)
    },
    getChartValuesYaml ({ envName }) {
      const serviceNames = []
      getAllChartValuesYamlAPI(this.projectName, envName, serviceNames).then(
        res => {
          res.forEach(re => {
            const envInfo = {
              ...cloneDeep(chartInfoTemp),
              ...re
            }

            const allChartNameInfo = {}

            allChartNameInfo[re.serviceName] = {
              ...this.allChartNameInfo[re.serviceName]
            }
            allChartNameInfo[re.serviceName][re.envName] = envInfo

            this.$set(
              this.allChartNameInfo,
              re.serviceName,
              allChartNameInfo[re.serviceName]
            )
          })
        }
      )
    }
  },
  watch: {
    envNames: {
      handler (newV, oldV) {
        // 要初始化的环境数据
        let envNamesByGet = []
        if (!Array.isArray(newV)) {
          envNamesByGet = [newV]
        } else if (!oldV) {
          envNamesByGet = newV
        } else if (newV.length > oldV.length) {
          envNamesByGet = newV.filter(nv => {
            return !oldV.includes(nv)
          })
        }
        this.selectedEnv = Array.isArray(newV) ? (newV[newV.length - 1] || 'DEFAULT') : newV
        envNamesByGet.forEach(env => {
          if (env === 'DEFAULT' || !env) {
            return
          }
          // this.initAllChartNameInfo(env)
          this.getChartValuesYaml({ envName: env })
        })
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
  margin-top: 20px;

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
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .values {
    box-sizing: border-box;
    width: calc(~'100% - 160px');
    padding: 0 20px;
    border: 1px solid #dcdfe6;
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    .content {
      .title {
        height: 40px;
        line-height: 40px;
      }

      .desc {
        margin-top: 10px;
        color: #909399;
        font-size: 14px;
      }
    }
  }
}
</style>
