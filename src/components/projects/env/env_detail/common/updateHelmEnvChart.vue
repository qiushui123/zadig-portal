<template>
  <div class="helm-chart-yaml-content">
    <el-tabs tab-position="left" type="border-card" v-model="checkedChart">
      <el-tab-pane :label="name" :name="name" v-for="name in serviceNames" :key="name"></el-tab-pane>
    </el-tabs>
    <div class="values" v-if="checkedChart">
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
  yamlSource: '', // : String
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
      return this.chartNames
        ? this.chartNames.map(chart => chart.serviceName)
        : Object.keys(this.chartInfos)
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
    }
  },
  created () {
    if (this.chartInfos) {
      this.allChartNameInfo = this.chartInfos
    } else {
      this.initAllChartNameInfo()
    }
    this.checkedChart = Object.keys(this.allChartNameInfo)[0]
    console.log('--:', this.allChartNameInfo, this.checkedChart)
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
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  margin-top: 20px;

  /deep/.el-tabs {
    flex-shrink: 0;

    .el-tabs__header {
      margin-right: 0;
    }

    .el-tabs__content {
      padding: 0;
    }
  }

  .values {
    box-sizing: border-box;
    width: calc(~'100% - 250px');
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
