<template>
  <div>
    <div class="left">
      <el-tree ref="tree" node-key="id" class="tree" :data="nodeData"></el-tree>
    </div>
    <div class="right">
      <ServiceModule  :serviceModules="serviceModules" />
    </div>
  </div>
</template>
<script>
import { getServiceTemplatesAPI, serviceTemplateWithConfigAPI } from '@/api'
import ServiceModule from '@/components/projects/common/serviceModules'
export default {
  name: 'serviceBuild',
  components: {
    ServiceModule
  },
  data () {
    return {
      nodeData: [],
      serviceModules: []
    }
  },
  computed: {
    projectName () {
      //   return this.$route.params.project_name
      return 'micorservice-demo'
    }
  },
  methods: {
    async getServices () {
      const { data } = await getServiceTemplatesAPI(this.projectName)
      this.nodeData = data.map((item) => ({
        label: item.service_name,
        children: []
      }))
      if (data.length) {
        const { service_module } = await serviceTemplateWithConfigAPI(
          data[0].service_name,
          this.projectName
        )
        this.nodeData[0].children = service_module.map((item) => ({
          label: item.name
        }))
        this.serviceModules = service_module
      }
    }
  },
  mounted () {
    this.getServices()
  }
}
</script>
<style lang="less" scoped>
.content {
  display: flex;

  .left {
    width: 300px;
    height: 100%;
    border-right: 1px solid #ebedef;

    .tree {
      box-sizing: border-box;
      height: 100%;
      padding-top: 30px;
      padding-right: 20px;
      padding-left: 40px;
    }
  }

  .right {
    width: calc(~'100% - 340px');
    height: 100%;
    background-color: #fff;
  }
}
</style>
