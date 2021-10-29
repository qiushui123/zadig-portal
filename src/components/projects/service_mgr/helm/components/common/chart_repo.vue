<template>
  <div class="chart-repo-container">
    <el-form ref="form" :model="chartData" label-width="140px">
      <el-form-item prop="repoAttr" label="仓库属性">
        <el-radio-group v-model="chartData.repoAttr">
          <el-radio label="private">私有库</el-radio>
          <el-radio label="public">公开库</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-show="chartData.repoAttr === 'private'" label="导入源" prop="source">
        <el-select v-model="chartData.source" placeholder="选择 chart 导入源" size="small">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="chartData.repoAttr === 'private'" label="项目" prop="project">
        <el-select v-model="chartData.project" placeholder="选择 chart 项目" size="small">
          <el-option label="label" value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="chartData.repoAttr === 'public'" label="仓库地址" prop="address">
        <el-input v-model="chartData.address" placeholder="http://xx" size="small"></el-input>
      </el-form-item>
      <el-form-item label="Chart" class="chart-select">
        <div v-for="(chart, index) in chartData.charts" :key="chart.helm">
          <el-select v-model="chart.helm" placeholder="chart 名称" size="small">
            <el-option label="label" value="value"></el-option>
          </el-select>
          <el-select v-model="chart.version" placeholder="chart 版本" size="small">
            <el-option label="label" value="value"></el-option>
          </el-select>
          <span>
            <el-button v-show="chartData.charts.length > 1" size="mini" circle icon="el-icon-minus" @click="deleteChart(index)"></el-button>
            <el-button size="mini" circle icon="el-icon-plus" type="primary" @click="addChart"></el-button>
          </span>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="importChartRepo">导入</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ChartRepo',
  data () {
    return {
      chartData: {
        repoAttr: 'private',
        source: '',
        project: '',
        address: '',
        charts: [{
          helm: '',
          version: ''
        }]
      },
      sourceOptions: [],
      projectOptions: [],
      charts: [{
        helm: '',
        version: []
      }]
    }
  },
  props: {
    currentSelect: String
  },
  methods: {
    closeSelectRepo () {
      console.log('close chart')
    },
    importChartRepo () {
      // this.$store.commit('SERVICE_DIALOG_VISIBLE', false)
      console.log('importChartRepo', this.chartData)
    },
    deleteChart (index) {
      this.chartData.charts.splice(index, 1)
    },
    addChart () {
      this.chartData.charts.push({
        helm: '',
        version: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.chart-repo-container {
  /deep/ .el-form {
    .el-select {
      width: 100%;
    }

    .chart-select {
      .el-select {
        width: calc(~'50% - 45px');
        margin-right: 5px;
      }

      .el-button + .el-button {
        margin-left: 5px;
      }
    }
  }
}
</style>
