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
          <PageNav :displayedFile="displayedFile" :currentTab="currentTab" @updateFile="updateFile"></PageNav>
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

export default {
  data () {
    return {
      yaml: '',
      chartDialogVisible: false,
      currentTab: '',
      currentService: null,
      fileData: [
        {
          path: '.helmignore',
          name: '.helmignore',
          size: 349,
          is_dir: false
        },
        {
          path: 'Chart.yaml',
          name: 'Chart.yaml',
          size: 1138,
          is_dir: false,
          is_chart: false
        },
        {
          path: 'templates',
          name: 'templates',
          size: 4096,
          is_dir: true,
          is_chart: true,
          children: [
            {
              path: 'templates/NOTES.txt',
              name: 'NOTES.txt',
              size: 141,
              is_dir: false
            },
            {
              path: 'templates/_helpers.tpl',
              name: '_helpers.tpl',
              size: 1852,
              is_dir: false
            },
            {
              path: 'templates/deployment.yaml',
              name: 'deployment.yaml',
              size: 780,
              is_dir: false
            },
            {
              path: 'templates/service.yaml',
              name: 'service.yaml',
              size: 365,
              is_dir: false
            }
          ]
        },
        {
          path: 'values.yaml',
          name: 'values.yaml',
          size: 426,
          is_dir: false
        },
        {
          path: 'values.yamlxxxxxxxx',
          name: 'values.yamlxxxxxxxxxx',
          size: 426,
          is_dir: false
        }
      ],
      displayedFile: []
    }
  },
  methods: {
    handleFileClick (data) {
      console.log('这里要判断一下，需要请求chart内容')
      if (!data.is_dir) {
        this.currentTab = data.path
        const filter = this.displayedFile.filter(
          file => file.path === data.path
        )
        if (filter.length === 0) {
          this.displayedFile.push(data)
          console.log('点击文件，请求文件内容：', data)
        }
      }
    },
    updateFile ({ data, index }) {
      this.currentTab = data ? data.path : ''
      console.log('切换文件内容：', data)
    },
    deleteChart (data) {
      this.$confirm(`确定要删除 ${data.name} 这个服务吗？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除 '
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          })
        })
    },
    refreshChart (data) {
      console.log('show dialog:', data)
    }
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
