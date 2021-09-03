<template>
  <div class="folder-container">
    <el-tree :data="fileData" :props="defaultProps" @node-click="handleNodeClick">
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
    }
  },
  methods: {
    handleNodeClick (data) {
      this.$emit('clickFile', data)
    },
    deleteChart (data) {
      this.$emit('deleteChart', data)
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
