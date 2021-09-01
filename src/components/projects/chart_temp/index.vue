<template>
  <div class="chart-template-container">
    <el-dialog title="请选择导入源" :visible.sync="chartDialogVisible" :close-on-click-modal="false">
      <ImportChart></ImportChart>
    </el-dialog>
    <multipane>
      <div class="pane left" :style="{minWidth: '200px', width: '230px', maxWidth: '400px'}">
        <div class="top">
          <el-button icon="el-icon-plus" circle size="mini" @click="chartDialogVisible = !chartDialogVisible"></el-button>
        </div>
        <Folder></Folder>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane center" :style="{width: '500px'}">
        <div class="top">
          <PageNav></PageNav>
        </div>
        <Codemirror v-model="yaml" :cmOption="{ readOnly: true }" class="mirror"></Codemirror>
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
      chartDialogVisible: false
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
        border-right: 1px solid #ebedef;
        border-left: 1px solid #ebedef;

        .top {
          background-color: #f5f7fa;
        }

        .mirror {
          height: calc(~'100% - 60px');
          padding: 5px;
        }
      }

      &.right {
        padding: 10px 20px 20px;
      }
    }
  }
}
</style>
