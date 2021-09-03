<template>
  <div class="chart-template-container">
    <el-dialog title="请选择导入源" :visible.sync="chartDialogVisible" :close-on-click-modal="false">
      <ImportChart v-model="chartDialogVisible" :currentService="currentService"></ImportChart>
    </el-dialog>
    <multipane>
      <div class="pane left" :style="{minWidth: '200px', width: '230px', maxWidth: '400px'}">
        <div class="top">
          <el-button icon="el-icon-plus" circle size="mini" @click="chartDialogVisible = !chartDialogVisible"></el-button>
        </div>
        <Folder :fileData="fileData" @clickFile="handleFileClick" @deleteChart="deleteChart" @refreshChart="refreshChart"></Folder>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane center" :style="{minWidth: '200px', width: '500px'}">
        <div class="top">
          <PageNav :displayedFile="displayedFile" :currentTab="currentTab" @updateFile="showFile"></PageNav>
        </div>
        <Codemirror v-if="currentTab" v-model="yaml" :cmOption="{ readOnly: false }" class="mirror"></Codemirror>
      </div>
      <multipane-resizer></multipane-resizer>
      <ModuleUse class="pane right" :style="{flexGrow: 1, width: '100px'}"></ModuleUse>
    </multipane>
  </div>
</template>

<script>
import { Multipane, MultipaneResizer } from 'vue-multipane'
import Codemirror from '@/components/projects/common/codemirror.vue'
import ModuleUse from './module_use.vue'
import Folder from './folder.vue'
import ImportChart from './import_chart.vue'
import PageNav from './page_nav.vue'
import {
  getChartTemplatesAPI,
  getChartTemplateByNameAPI,
  getTemplateFileContentAPI
} from '@api'
import { keyBy } from 'lodash'

function tree ({ chartName, files }) {
  const result = []
  const level = { result }
  files.forEach(file => {
    const path = file.path
    path.split('/').reduce((r, name, i, a) => {
      if (!r[name]) {
        r[name] = { result: [] }
        r.result.push(
          Object.assign(file, {
            name,
            children: r[name].result,
            chartName,
            fullPath: `${chartName}/${file.path}`
          })
        )
      }
      return r[name]
    }, level)
  })
  return result
}

export default {
  data () {
    return {
      yaml: '',
      chartDialogVisible: false,
      currentTab: '',
      currentService: null,
      fileData: [],
      displayedFile: [],
      yamlSet: {}
    }
  },
  computed: {
    fileDataObj () {
      return keyBy(this.fileData, 'name')
    }
  },
  methods: {
    handleFileClick (data) {
      if (data.is_chart) {
        // 请求 chart 目录文件
        this.getChartTemplateByName(data.name)
        return
      }
      if (!data.is_dir) {
        this.showFile({ data })
      }
    },
    async showFile ({ data, index }) {
      this.currentTab = data ? data.path : ''
      const filter = this.displayedFile.filter(file => file.path === data.path)
      if (filter.length === 0) {
        this.displayedFile.push(data)
      }
      if (!this.yamlSet[`${data.chartName}/${data.path}`]) {
        await this.getTemplateFileContent(data.chartName, data.path)
      }
      this.yaml = this.yamlSet[`${data.chartName}/${data.path}`]
    },
    deleteChart (data) {
      console.log('deleteChart:', data)
    },
    refreshChart (data) {
      console.log('show dialog:', data)
    },
    getChartTemplates () {
      return getChartTemplatesAPI().then(res => {
        const list = res.map(re => {
          return {
            name: re.name,
            is_chart: true,
            is_dir: true,
            fullPath: re.name,
            children: []
          }
        })
        this.fileData = list
        return res
      })
    },
    getChartTemplateByName (name) {
      if (this.fileDataObj[name].children.length) {
        return Promise.resolve()
      }
      return getChartTemplateByNameAPI(name).then(res => {
        this.fileDataObj[name].children = tree({
          chartName: name,
          files: res.files
        })
      })
    },
    async getTemplateFileContent (charName, fileName, filePath = '') {
      const res = await getTemplateFileContentAPI(
        charName,
        fileName,
        filePath
      ).catch(err => {
        console.log(err)
      })
      if (res) {
        this.$set(this.yamlSet, `${charName}/${fileName}`, res)
      }
    }
  },
  created () {
    this.getChartTemplates().then(res => {
      if (res.length) {
        const name = res[0].name
        this.getChartTemplateByName(name).then(() => {
          this.showFile({ data: this.fileDataObj[name].children[0] })
        })
      }
    })
  },
  components: {
    Multipane,
    MultipaneResizer,
    Codemirror,
    ModuleUse,
    Folder,
    ImportChart,
    PageNav
  }
}
</script>

<style lang="less" scoped>
.chart-template-container {
  width: 100%;
  height: 100%;

  /deep/.multipane {
    width: 100%;
    height: 100%;

    .multipane-resizer {
      position: relative;
      z-index: 2;

      &::before {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 56px;
        margin-top: -28px;
        margin-left: -5px;
        background: white;
        border: 1px solid #dbdbdb;
        border-radius: 4px;
        content: '';
      }
    }

    .pane {
      .top {
        height: 50px;
        line-height: 50px;
      }

      &.left {
        .top {
          padding: 0 10px;
          text-align: right;
          border-bottom: 1px solid #e6e6e6;
        }
      }

      &.center {
        background-color: #f5f7fa;
        border-right: 1px solid #ebedef;
        border-left: 1px solid #ebedef;

        .mirror {
          height: calc(~'100% - 60px');
          padding: 5px;
        }
      }

      &.right {
        box-sizing: border-box;
        padding: 10px 20px 20px;
      }
    }
  }
}
</style>
