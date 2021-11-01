<template>
  <div class="service-order">
    <el-tree
      :props="defaultProps"
      :data="nodeData"
      node-key="label"
      default-expand-all
      draggable
      @node-drop="handleDrop"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: 'serviceOrder',
  props: {
    services: {
      default: () => {
        return [
          ['go-sample-site-2', 'gss-5', 'gss-2', 'gss-1', 'gss-4'],
          ['gss-11', 'gss-13', 'gss-14', 'gss-10', 'gss-12', 'gss-7', 'gss-9'],
          [
            'gss-21',
            'gss-19',
            'gss-6',
            'gss-18',
            'gss-23',
            'gss-24',
            'gss-8',
            'gss-22',
            'gss-20',
            'gss-15',
            'gss-17',
            'gss-16',
            'gss-25',
            'gss-3'
          ]
        ]
      }
    }
  },
  data () {
    return {
      defaultProps: { children: 'children', label: 'label' },
      nodeData: []
    }
  },
  methods: {
    handleDrop (draggingNode, dropNode, dropType, ev) {
      const length = this.nodeData.length
      if (this.nodeData[length - 1].children.length !== 0) {
        this.nodeData.push({
          label: `启动顺序 ${length}`,
          children: []
        })
      }
      const res = Object.values(this.nodeData).map(node => {
        return node.children.map(child => child.label)
      })
      console.log('put数据：', res)
    },
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.data.label.indexOf('启动顺序') === -1) {
        return type !== 'inner'
      } else {
        return type === 'inner'
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.data.label.indexOf('启动顺序') === -1
    },
    generateNodeData () {
      const nodeData = []
      this.services.forEach((service, index) => {
        nodeData.push({
          label: `启动顺序 ${index}`,
          children: service.map(se => {
            return {
              label: se
            }
          })
        })
      })
      nodeData.push({
        label: `启动顺序 ${nodeData.length}`,
        children: []
      })
      this.nodeData = nodeData
    }
  },
  created () {
    this.generateNodeData()
  }
}
</script>
