<template>
  <div>
    <div class="left">
      <el-tree ref="tree" node-key="id" class="tree" @node-click="handlerNodeClick" :data="nodeData"></el-tree>
    </div>
    <div class="right">
      <ServiceModule :openBuild="openBuild" v-show="!build.showModal"  :serviceModules="serviceModules" />
      <Build  v-show="build.showModal" :name="build.name" :isEdit="build.isEdit" :buildName="build.buildName" />
    </div>
  </div>
</template>
<script>
import { getServiceTemplatesAPI, serviceTemplateWithConfigAPI } from '@/api'
import ServiceModule from '@/components/projects/common/serviceModules'
import Build from '@/components/projects/common/hosting/build'

export default {
  name: 'serviceBuild',
  components: {
    ServiceModule,
    Build
  },
  data () {
    return {
      nodeData: [],
      serviceModules: [],
      build: {
        name: null,
        isEdit: false,
        buildName: null,
        showModal: false
      }
    }
  },
  computed: {
    projectName () {
      //   return this.$route.params.project_name
      return 'micorservice-demo'
    }
  },
  methods: {
    openBuild (data) {
      if (data.build_name) {
        this.build.name = data.name
        this.build.buildName = data.build_name
        this.build.isEdit = true
      } else {
        this.build.name = data.name
        this.build.buildName = null
        this.build.isEdit = false
      }
      this.build.showModal = true
    },
    handlerNodeClick (data) {
      if (!data.children) {
        this.openBuild(data)
      } else {
        this.getServiceModules(data)
        this.build.showModal = false
      }
    },
    async getServiceModules (data) {
      const { service_module } = await serviceTemplateWithConfigAPI(
        data.label,
        this.projectName
      )
      data.children = service_module.map((item) => ({
        label: item.name,
        name: item.name,
        build_name: item.build_name
      }))
      this.serviceModules = service_module
    },
    async getServices () {
      const { data } = await getServiceTemplatesAPI(this.projectName)
      this.nodeData = data.map((item) => ({
        label: item.service_name,
        children: []
      }))
      if (data.length) {
        this.getServiceModules(this.nodeData[0])
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
    overflow: scroll;
    background-color: #fff;
  }
}
</style>
