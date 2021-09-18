<template>
  <div class="folder-container">
    <el-tree :data="fileData" :props="defaultProps" @node-click="handleNodeClick" :default-expanded-keys="expandedKeys" node-key="fullPath">
      <span slot-scope="{data}">
        <i class="icon el-icon-document" v-if="!data.is_dir"></i>
        <i class="icon el-icon-folder" v-else></i>
        {{ data.name }}
        <span class="display-none" :class="{folder: data.is_chart}">
          <i class="icon el-icon-close" @click.stop="deleteChart(data)"></i>
          <i class="icon el-icon-refresh" @click.stop="updateChart(data)"></i>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { deleteChartTemplateAPI } from '@api'

export default {
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  props: {
    fileData: {
      require: true,
      type: Array,
      default: () => {
        return []
      }
    },
    expandedKeys: {
      require: true,
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('clickFile', data)
    },
    deleteChart (data) {
      this.$confirm(`确定要删除 ${data.name} 这个模板吗？`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteChartTemplateAPI(data.name).then(() => {
            this.$message({
              type: 'success',
              message: '模板删除成功'
            })
            this.$emit('deleteChart', { deleteFlag: true, name: data.name })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除模板'
          })
        })
    },
    updateChart (data) {
      this.$emit('refreshChart', data)
    }
  }
}
</script>

<style lang="less" scoped>
.folder-container {
  padding: 5px;
  padding-top: 10px;
  font-size: 13px;

  /deep/ .el-tree {
    background-color: transparent;

    .el-tree-node__content {
      .icon {
        color: #1989fa;
      }

      .display-none {
        display: none;
      }

      &:hover {
        .display-none.folder {
          display: inline-block;

          .icon {
            padding-left: 10px;
          }
        }
      }
    }
  }
}
</style>
