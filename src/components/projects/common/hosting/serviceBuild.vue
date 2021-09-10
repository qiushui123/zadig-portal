<template>
  <div class="content">
    <div class="left">
      <el-tree
        ref="treeRef"
        node-key="id"
        class="tree"
        :highlight-current="true"
        @node-click="handlerNodeClick"
        :data="nodeData"
      >
        <span class="custom-tree-node" slot-scope="{ data }">
          <i class="iconfont iconrongqifuwu" v-if="data.children"></i>
          <span class="label">{{ data.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="right">
      <ServiceModule
        :openBuild="openBuild"
        v-show="!build.showModal"
        :serviceModules="serviceModules"
      />
      <Build
        ref="build"
        :handlerSubmit="handlerSubmit"
        v-show="build.showModal"
        :name="build.name"
        :isEdit="build.isEdit"
        :buildName="build.buildName"
      />
      <div class="bottom">
        <el-button
         v-show="build.showModal"
          type="primary"
          size="small"
          class="save-btn"
          @click="saveBuild"
          plain
          >保存构建
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getServiceTemplatesAPI, serviceTemplateWithConfigAPI } from '@/api'
import ServiceModule from '../serviceModules'
import Build from './build'

export default {
  name: 'serviceBuild',
  props: {
    envName: String,
    serviceName: String
  },
  components: {
    ServiceModule,
    Build
  },
  data () {
    return {
      nodeData: [
        {
          label: 'zadig-mimo',
          name: 'zadig-mimo',
          key: 0,
          children: [{ label: 'poetry1', name: 'poetry1', key: 2 }]
        },
        {
          key: 1,
          label: 'poetry',
          name: 'poetry',
          children: [{ label: 'poetry2', name: 'poetry2', key: 3 }]
        }
      ],
      serviceModules: [],
      build: {
        name: null,
        isEdit: false,
        buildName: null,
        showModal: false,
        serviceName: null
      }
    }
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  methods: {
    async saveBuild () {
      const res = await this.$refs.build.updateBuildConfig()
      if (res) {
        this.getServices()
        this.getServiceModules({ label: this.build.serviceName })
        this.build.showModal = false
      }
    },
    handlerSubmit () {
      this.build.showModal = false
    },
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
      this.build.serviceName = data.label
      const { service_module } = await serviceTemplateWithConfigAPI(
        data.label,
        this.projectName
      )
      data.children = service_module.map((item) => ({
        label: item.name,
        name: item.name,
        build_name: item.build_name,
        id: 'serviceModule' + item.name
      }))
      this.serviceModules = service_module
    },
    async getServices (init) {
      const { data } = await getServiceTemplatesAPI(
        this.projectName,
        this.envName
      )
      this.nodeData = data.map((item) => ({
        label: item.service_name,
        children: [],
        name: item.service_name,
        id: 'serviceName' + item.service_name
      }))
      if (data.length && init) {
        await this.getServiceModules(this.nodeData[0])
      }
    }
  },
  watch: {
    envName () {
      this.getServices('init')
    }
  },
  async mounted () {
    await this.getServices('init')
    if (this.serviceName) {
      const data = this.nodeData.find((item) => item.name === this.serviceName)
      this.getServiceModules(data)
      this.$nextTick(() => {
        this.currentKey = this.serviceName
        this.$refs.treeRef.setCurrentKey('serviceName' + this.currentKey)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  display: flex;

  .left {
    width: 260px;
    height: 100%;
    border-right: 1px solid #ebedef;

    .tree {
      box-sizing: border-box;
      height: 100%;
      padding-top: 30px;
      padding-right: 20px;
      padding-left: 20px;
    }
  }

  .right {
    width: calc(~'100% - 340px');
    height: 100%;
    overflow: scroll;
    background-color: #fff;

    .bottom {
      position: absolute;
      bottom: 61px;
      z-index: 999;
      width: calc(~'100% - 340px');
      height: 50px;
      background-color: #fff;

      .save-btn {
        margin-top: 10px;
        margin-left: 20px;
        color: #fff;
        background-color: #409eff;
      }
    }
  }
}
</style>
