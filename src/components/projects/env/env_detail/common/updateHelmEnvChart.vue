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
      <div class="title">Chart Version: {{allChartNameInfo[checkedChart].chartVersion}}</div>
      <ImportValues ref="importValuesRef" :resize="{direction: 'vertical'}" :importRepoInfo="allChartNameInfo[checkedChart]"></ImportValues>
      <KeyValue ref="keyValueRef" :keyValues="allChartNameInfo[checkedChart].overrideValues"></KeyValue>
    </div>
  </div>
</template>

<script>
import ImportValues from '@/components/projects/common/import_values/index.vue'
import KeyValue from '@/components/projects/common/import_values/key_value.vue'
import { cloneDeep } from 'lodash'
const chartInfo = {
  envName: '', // ?: String
  serviceName: '', // : String
  chartVersion: '', // : String
  yamlSource: 'default', // : String
  overrideValues: [], // : Object{key,value}[]
  valuesYAML: '', // : String
  gitRepoConfig: null // : Object
}
export default {
  name: 'ChartValues',
  props: {
    chartNames: {
      type: Array, // Object{serviceName}[]
      required: false,
      default: () => null
    },
    envTabs: {
      type: [Array, Boolean],
      required: true
    },
    chartInfos: {
      // TODO 这里不应该要 更新环境变量更改后 再删掉  其他不用这个
      // 结构与 this.allChartNameInfo 保持一致
      type: Object,
      required: false,
      default: () => null
    }
  },
  data () {
    return {
      allChartNameInfo: {}, // key: serviceName
      checkedChart: ''
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
    }
  },
  methods: {
    getAllChartNameInfo () {
      return this.allChartNameInfo
    },
    resetAllChartNameInfo () {
      this.allChartNameInfo = {}
    },
    initAllChartNameInfo () {
      this.chartNames.forEach(chart => {
        this.$set(this.allChartNameInfo, chart.serviceName, {
          ...cloneDeep(chartInfo),
          serviceName: chart.serviceName
        })
      })
      this.checkedChart = Object.keys(this.allChartNameInfo)[0]
    },
    initAllChartNameInfoByChartInfos () {
      for (const key in this.chartInfos) {
        this.chartInfos[key] = {
          ...cloneDeep(chartInfo),
          ...this.chartInfos[key]
        }
      }
      this.allChartNameInfo = this.chartInfos
      this.checkedChart = Object.keys(this.allChartNameInfo)[0]
    },
    validate () {
      const valid = []
      if (this.$refs.importValuesRef) {
        valid.push(this.$refs.importValuesRef.validate())
      }
      if (this.$refs.keyValueRef) valid.push(this.$refs.keyValueRef.validate())
      return Promise.all(valid)
    }
  },
  created () {
    this[
      this.chartInfos
        ? 'initAllChartNameInfoByChartInfos'
        : 'initAllChartNameInfo'
    ]()
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
    padding: 20px;
    border: 1px solid #dcdfe6;
    border-left-width: 0;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);

    .title {
      line-height: 40px;
    }
  }
}
</style>
