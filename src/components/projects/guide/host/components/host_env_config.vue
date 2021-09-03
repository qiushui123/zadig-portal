<template>
    <div class="form-content">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="form"
        label-position="left"
      >
        <el-form-item prop="env_name"  label="环境名称">
          <el-input v-model="form.env_name" placeholder="请输入环境名称"></el-input>
        </el-form-item>
        <el-form-item prop="cluster_id" label="集群">
          <el-select filterable v-model="form.cluster_id" placeholder="请选择集群"  @change="changeCluster">
             <el-option label="本地集群" value=""></el-option>
             <el-option v-for="cluster in allCluster"
                         :key="cluster.id"
                         :label="`${cluster.name} （${cluster.production?'生产集群':'测试集群'})`"
                         :value="cluster.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="namespace" label="命名空间">
          <el-select filterable v-model="form.namespace" placeholder="命名空间" @change="changeNamespace">
             <el-option v-for="(ns,index) in hostingNamespace"
                         :key="index"
                         :label="ns.name"
                         :value="ns.name">
              </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="transfer-title">服务列表</div>
      <el-transfer
        filter-placeholder="请输入服务名称"
        v-model="selectService"
        :titles="['服务列表', '已选服务']"
        :data="serviceList"
        class="transfer"
      >
      <div slot="left-footer">
          <el-pagination
            layout="prev, pager, next"
            @current-change="changePage"
            :page-size="20"
            :total="total">
          </el-pagination>
      </div>
      </el-transfer>
    </div>
</template>
<script>
import { getClusterListAPI, productHostingNamespaceAPI, queryWorkloads, postWorkloads } from '@/api'
export default {
  name: 'host_env_config',
  data () {
    return {
      allCluster: [],
      hostingNamespace: [],
      form: {
        env_name: null,
        cluster_id: null,
        namespace: null
      },
      rules: {
        env_name: [{ required: true, message: '请输入环境名称', trigger: 'blur' }],
        cluster_id: [{ required: true, message: '请选择集群', trigger: 'blur' }],
        namespace: [{ required: true, message: '请选择命名空间', trigger: 'blur' }]
      },
      serviceList: [],
      total: 0,
      selectService: []

    }
  },
  methods: {
    clearTransfer () {
      this.serviceList = []
      this.selectService = []
    },
    async changeNamespace () {
      this.clearTransfer()
      this.getWorkloads(1)
    },
    async getWorkloads (page) {
      const res = await queryWorkloads(this.form.cluster_id, this.form.namespace, page)
      this.total = res.headers['x-total'] ? parseInt(res.headers['x-total']) : 0
      this.serviceList = res.data.services.map((item, index) => {
        return {
          label: item.service_name,
          key: index
        }
      })
    },
    changePage (page) {
      this.getWorkloads(page)
    },
    async getCluster () {
      const res = await getClusterListAPI()
      this.allCluster = res.filter(element => {
        return element.status === 'normal'
      })
    },
    changeCluster (clusterId) {
      this.hostingNamespace = []
      this.clearTransfer()
      productHostingNamespaceAPI(clusterId).then((res) => {
        this.hostingNamespace = res
      })
    },
    nextStep (step) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit(step)
        } else {
          return false
        }
      })
    },
    submit (step) {
      // this.$router.push(`/v1/projects/create/${this.projectName}/host/config?step=${step}`)

    }
  },
  created () {
    this.getCluster()
  }
}
</script>
<style lang='less' scoped>
  .form-content {
    height: 100%;
    padding-left: 100px;
    background-color: #ffffff;

    .form {
      width: 500px;
      margin-top: 30px;

      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-transfer-panel {
      width: 360px;
    }

    .transfer {
      margin-bottom: 20px;
    }

    .transfer-title {
      margin-bottom: 20px;
      color: #606266;
      font-size: 14px;
    }

    /deep/ .el-pagination {
      padding: 5px 5px 1px 2px;
    }
  }
</style>
