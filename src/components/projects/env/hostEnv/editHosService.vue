<template>
       <el-transfer
        filter-placeholder="请输入服务名称"
        v-model="selectService"
        :titles="['服务列表', '已选服务']"
        :data="serviceList"
        class="transfer"
        :render-content="renderFunc"
        :filterable="true"
      >
      </el-transfer>
</template>
<script>
import { queryServiceWorkloads, queryWorkloads, editWorkloads } from '@/api'

export default {
  name: 'edithostservice',
  props: {
    projectName: String
  },
  data () {
    return {
      allCluster: [],
      hostingNamespace: [],
      form: null,
      rules: {
        env_name: [{ required: true, message: '请输入环境名称', trigger: 'blur' }]
      },
      serviceList: [],
      selectService: [],
      renderFunc (h, option) {
        if (option.env_name) {
          const content = `使用项目：${option.product_name}；使用环境：${option.env_name}`
          return <el-tooltip content={content} placement="top">
            <span>{ option.label }</span>
          </el-tooltip>
        } else {
          return <el-tooltip content={option.images && option.images[0]} placement="top">
            <span>{ option.label }</span>
          </el-tooltip>
        }
      }
    }
  },
  methods: {
    async getWorkloads (page) {
      const res = await queryWorkloads(this.form.clusterId, this.form.namespace, page)
      this.serviceList = res.data.services.map((item, index) => {
        return {
          label: item.service_name,
          key: item.service_name,
          disabled: !!item.env_name && (item.env_name !== this.form.envName),
          name: item.service_name,
          type: item.workLoadType,
          product_name: item.product_name,
          env_name: item.env_name,
          images: item.images
        }
      })
    },
    async getServices () {
      const { data } = await queryServiceWorkloads(
        this.form.productName,
        this.form.envName
      )
      this.selectService = data.map((item, index) => {
        return item.service_name
      })
    },
    async submit (step) {
      const workloads = this.serviceList.filter(item => {
        return this.selectService.includes(item.key)
      })
      const form = {
        env_name: this.form.envName,
        cluster_id: this.form.clusterId,
        namespace: this.form.namespace,
        workloads: workloads,
        product_name: this.projectName
      }
      const res = await editWorkloads(form)
      if (res) {
        const params = {
          step: step,
          envName: this.form.envName
        }
        this.$router.push({ path: `/v1/projects/detail/${this.projectName}/envs/externalConfig`, query: params })
      }
    }
  },
  created () {
    this.form = this.$route.query
    this.getWorkloads(1)
    this.getServices()
  }
}
</script>
<style lang="less" scoped>
    /deep/ .el-transfer-panel {
      width: 360px;
    }
</style>
