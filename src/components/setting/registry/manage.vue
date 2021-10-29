<template>
  <div v-loading="loading"
       element-loading-text="加载中..."
       element-loading-spinner="iconfont iconfont-loading icondocker"
       class="setting-registry-container">
    <!--registry-create-dialog-->
    <el-dialog title='添加'
               :visible.sync="dialogRegistryCreateFormVisible"
               :close-on-click-modal="false"
               custom-class="dialog-style"
               width="35%">
      <el-form ref="registry"
               :rules="rules"
               label-width="150px"
               label-position="left"
               :model="registry">
        <el-form-item label="默认使用"
                      prop="is_default">
          <el-checkbox v-model="registry.is_default"></el-checkbox>
        </el-form-item>
        <el-form-item label="提供商"
                      prop="reg_provider">
          <el-select v-model="registry.reg_provider"
                     style="width: 100%;"
                     size="small"
                     placeholder="请选择镜像仓库提供商">
            <el-option value="acr"
                       label="阿里云 ACR">
              <i class="iconfont iconaliyun"></i> <span>阿里云 ACR</span>
            </el-option>

            <el-option value="swr"
                       label="华为云 SWR">
              <i class="iconfont iconhuawei"></i> <span>华为云 SWR</span>
            </el-option>
            <el-option value="tcr"
                       label="腾讯云 TCR">
              <i class="iconfont icontengxunyun"></i> <span>腾讯云 TCR</span>
            </el-option>
            <el-option value="harbor"
                       label="Harbor">
              <i class="iconfont iconHarbor"></i> <span>Harbor</span>
            </el-option>
            <el-option value="dockerhub"
                       label="DockerHub">
              <i class="iconfont icondocker"></i> <span>DockerHub</span>
            </el-option>
            <el-option value="native"
                       label="其它">
              <i class="iconfont iconqita"></i> <span>其它</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="registry.reg_provider === 'swr'"
                      label="区域"
                      prop="region">
          <el-input size="small"
                    clearable
                    v-model="registry.region"></el-input>
        </el-form-item>
        <el-form-item label="地址"
                      prop="reg_addr">
          <el-input size="small"
                    clearable
                    v-model="registry.reg_addr"></el-input>
        </el-form-item>
        <el-form-item prop="namespace">
          <template slot="label">
            {{ registry.reg_provider ? providerMap[registry.reg_provider].namespace : 'Namespace' }}
          </template>
          <el-input size="small"
                    clearable
                    v-model="registry.namespace"></el-input>
        </el-form-item>
        <el-form-item :label="registry.reg_provider === 'swr'?'Access Key':'Docker 用户名'"
                      :rules="{ required: true, message: `请输入 ${registry.reg_provider === 'swr'?'Access Key':'Docker 用户名'}`, trigger: 'blur' }"
                      prop="access_key">
          <el-input size="small"
                    clearable
                    v-model="registry.access_key"></el-input>
        </el-form-item>
        <el-form-item :label="registry.reg_provider === 'swr'?'Secret Key':'Docker 密码'"
                      :rules="{ required: true, message: `请输入 ${registry.reg_provider === 'swr'?'Secret Key':'Docker 密码'}`, trigger: 'blur' }"
                      prop="secret_key">
          <el-input size="small"
                    clearable
                    type="passsword"
                    v-model="registry.secret_key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   @click="dialogRegistryCreateFormVisible = false">取 消</el-button>
        <el-button :plain="true"
                   type="success"
                   size="small"
                   @click="registryOperation('add')">保存</el-button>
      </div>
    </el-dialog>
    <!--registry-create-dialog-->

    <!--registry-edit-dialog-->
    <el-dialog title='修改'
               :visible.sync="dialogRegistryEditFormVisible"
               :close-on-click-modal="false"
               custom-class="dialog-style"
               width="35%">
      <el-form ref="swapRegistry"
               :rules="rules"
               label-width="150px"
               label-position="left"
               :model="swapRegistry">
        <el-form-item label="默认使用"
                      prop="is_default">
          <el-checkbox v-model="swapRegistry.is_default"></el-checkbox>
        </el-form-item>
        <el-form-item label="提供商"
                      prop="reg_provider">
          <el-select v-model="swapRegistry.reg_provider"
                     style="width: 100%;"
                     size="small"
                     placeholder="请选择镜像仓库提供商">
            <el-option value="acr"
                       label="阿里云 ACR">
              <i class="iconfont iconaliyun"></i> <span>阿里云 ACR</span>
            </el-option>

            <el-option value="swr"
                       label="华为云 SWR">
              <i class="iconfont iconhuawei"></i> <span>华为云 SWR</span>
            </el-option>
            <el-option value="tcr"
                       label="腾讯云 TCR">
              <i class="iconfont icontengxunyun"></i> <span>腾讯云 TCR</span>
            </el-option>
            <el-option value="harbor"
                       label="Harbor">
              <i class="iconfont iconHarbor"></i> <span>Harbor</span>
            </el-option>
            <el-option value="dockerhub"
                       label="DockerHub">
              <i class="iconfont icondocker"></i> <span>DockerHub</span>
            </el-option>
            <el-option value="native"
                       label="其它">
              <i class="iconfont iconqita"></i> <span>其它</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="swapRegistry.reg_provider === 'swr'"
                      label="区域"
                      prop="region">
          <el-input size="small"
                    clearable
                    v-model="swapRegistry.region"></el-input>
        </el-form-item>
        <el-form-item label="地址"
                      prop="reg_addr">
          <el-input size="small"
                    clearable
                    v-model="swapRegistry.reg_addr"></el-input>
        </el-form-item>
        <el-form-item prop="namespace">
          <template slot="label">
            {{ swapRegistry.reg_provider ? providerMap[swapRegistry.reg_provider].namespace : 'Namespace' }}
          </template>
          <el-input size="small"
                    clearable
                    v-model="swapRegistry.namespace"></el-input>
        </el-form-item>
        <el-form-item :label="swapRegistry.reg_provider === 'swr'?'Access Key':'Docker 用户名'"
                      :rules="{ required: true, message: `请输入 ${swapRegistry.reg_provider === 'swr'?'Access Key':'Docker 用户名'}`, trigger: 'blur' }"
                      prop="access_key">
          <el-input size="small"
                    clearable
                    v-model="swapRegistry.access_key"></el-input>
        </el-form-item>
        <el-form-item :label="swapRegistry.reg_provider === 'swr'?'Secret Key':'Docker 密码'"
                      :rules="{ required: true, message: `请输入 ${swapRegistry.reg_provider === 'swr'?'Secret Key':'Docker 密码'}`, trigger: 'blur' }"
                      prop="secret_key">
          <el-input size="small"
                    clearable
                    type="passsword"
                    v-model="swapRegistry.secret_key"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   @click="dialogRegistryEditFormVisible = false">取 消</el-button>
        <el-button :plain="true"
                   type="success"
                   size="small"
                   @click="registryOperation('update')">保存</el-button>
      </div>
    </el-dialog>
    <!--registry-edit-dialog-->
    <div class="section">
      <el-alert type="info"
                :closable="false">
        <template>
          支持集成云厂商提供的标准镜像仓库或者自建镜像仓库<br />
          镜像仓库主要用于存放构建输出的镜像以及预发布的镜像，涉及到工作流的运行，以及集成环境的启动<br />
          集成镜像仓库可参考
          <el-link style="font-size: 14px; vertical-align: baseline;"
                   type="primary"
                   :href="`https://docs.koderover.com/zadig/settings/image-registry/`"
                   :underline="false"
                   target="_blank">帮助文档</el-link>
        </template>
      </el-alert>
      <div class="sync-container">
        <el-button :plain="true"
                   @click="addRegistryBtn"
                   size="small"
                   type="success">新建</el-button>
      </div>
      <div class="registry-list">
        <template>
          <el-table :data="allRegistry"
                    style="width: 100%;">
            <el-table-column label="提供商/地址/Namespace">
              <template slot-scope="scope">
                <i :class="getProviderMap(scope.row.reg_provider,'icon')"></i>
                <span>{{`${scope.row.reg_addr.split('://')[1]}/${scope.row.namespace}`}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150px"
                             label="默认使用">
              <template slot-scope="scope">
                <el-tag size="small"
                        v-if="scope.row.is_default">默认使用</el-tag>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column width="220px"
                             label="修改时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span
                      style="margin-left: 5px;">{{ $utils.convertTimestamp(scope.row.update_time) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="最后修改">
              <template slot-scope="scope">
                <span>{{ scope.row.update_by}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             width="180px">
              <template slot-scope="scope">
                <el-button @click="registryOperation('edit',scope.row)"
                           size="mini">编辑</el-button>
                <el-button @click="registryOperation('delete',scope.row)"
                           size="mini"
                           type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>

import { getRegistryListAPI, createRegistryAPI, updateRegistryAPI, deleteRegistryAPI } from '@api'
import bus from '@utils/event_bus'
export default {
  data () {
    return {
      allRegistry: [],
      registry: {
        namespace: '',
        reg_addr: '',
        access_key: '',
        secret_key: '',
        reg_provider: '',
        region: '',
        is_default: false
      },
      swapRegistry: {
        namespace: '',
        reg_addr: '',
        reg_provider: 'native',
        region: '',
        access_key: '',
        secret_key: '',
        is_default: false
      },
      providerMap: {
        native: {
          icon: 'iconfont logo iconqita',
          name: '其它',
          namespace: 'Namespace'
        },
        swr: {
          icon: 'iconfont logo iconhuawei',
          name: '华为云 SWR',
          namespace: '组织名称'
        },
        acr: {
          icon: 'iconfont logo iconaliyun ',
          name: '阿里云 ACR',
          namespace: '命名空间'
        },
        tcr: {
          icon: 'iconfont logo icontengxunyun',
          name: '腾讯云 TCR',
          namespace: '命名空间'
        },
        harbor: {
          icon: 'iconfont logo iconHarbor',
          name: 'Harbor',
          namespace: '项目'
        },
        dockerhub: {
          icon: 'iconfont logo icondocker',
          name: 'DockerHub',
          namespace: 'Namespace'
        }
      },
      dialogRegistryCreateFormVisible: false,
      dialogRegistryEditFormVisible: false,
      loading: true,
      rules: {
        reg_provider: [{ required: true, message: '请选择镜像仓库提供商', trigger: 'blur' }],
        reg_addr: [{
          required: true,
          message: '请输入 URL',
          trigger: 'blur'
        },
        {
          type: 'url',
          message: '请输入正确的 URL，包含协议',
          trigger: ['blur', 'change']
        }],
        region: [{ required: true, message: '请输入区域', trigger: 'blur' }],
        namespace: [{ required: true, message: '请输入 Namespace', trigger: 'blur' }]
      }
    }
  },
  methods: {
    addRegistryBtn () {
      if (this.allRegistry.length === 0) {
        this.registry.is_default = true
      } else {
        this.registry.is_default = false
      }
      this.dialogRegistryCreateFormVisible = true
    },
    getProviderMap (name, type) {
      if (this.providerMap[name] && type) {
        return this.providerMap[name][type]
      } else {
        return this.providerMap.native.icon
      }
    },
    registryOperation (operate, current_registry) {
      if (operate === 'add') {
        this.$refs.registry.validate(valid => {
          if (valid) {
            const payload = this.registry
            this.dialogRegistryCreateFormVisible = false
            this.addRegistry(payload)
          } else {
            return false
          }
        })
      } else if (operate === 'edit') {
        this.swapRegistry = this.$utils.cloneObj(current_registry)
        this.dialogRegistryEditFormVisible = true
      } else if (operate === 'update') {
        this.$refs.swapRegistry.validate(valid => {
          if (valid) {
            const id = this.swapRegistry.id
            const payload = this.swapRegistry
            this.dialogRegistryEditFormVisible = false
            this.updateRegistry(id, payload)
          } else {
            return false
          }
        })
      } else if (operate === 'delete') {
        const id = current_registry.id
        this.$confirm(`确定要删除 ${current_registry.namespace} ?`, '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(({ value }) => {
          deleteRegistryAPI(id).then((res) => {
            this.getRegistry()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          })
        })
      }
    },
    addRegistry (payload) {
      createRegistryAPI(payload).then((res) => {
        this.$refs.registry.resetFields()
        this.getRegistry()
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      })
    },
    updateRegistry (id, payload) {
      updateRegistryAPI(id, payload).then((res) => {
        this.$refs.swapRegistry.resetFields()
        this.getRegistry()
        this.$message({
          type: 'success',
          message: '更新成功'
        })
      })
    },
    getRegistry () {
      this.loading = true
      getRegistryListAPI().then((res) => {
        this.loading = false
        this.allRegistry = res
      })
    }
  },
  watch: {
    'registry.reg_provider': {
      deep: true,
      immediate: false,
      handler: function (val, oldVal) {
        if (val === 'dockerhub') {
          this.registry.reg_addr = 'https://registry.hub.docker.com'
        }
      }
    }
  },
  created () {
    bus.$emit(`set-topbar-title`, { title: '镜像仓库', breadcrumb: [] })
    bus.$emit(`set-sub-sidebar-title`, {
      title: '',
      routerList: []
    })
    this.getRegistry()
  }
}
</script>

<style lang="less">
.setting-registry-container {
  position: relative;
  flex: 1;
  padding: 15px 30px;
  overflow: auto;
  font-size: 13px;

  .module-title h1 {
    margin-bottom: 1.5rem;
    font-weight: 200;
    font-size: 2rem;
  }

  .section {
    margin-bottom: 56px;

    .sync-container {
      padding-top: 15px;
      padding-bottom: 15px;
      overflow: hidden;

      .el-button--success.is-plain {
        color: #13ce66;
        background: #fff;
        border-color: #13ce66;
      }

      .el-button--success.is-plain:hover {
        color: #13ce66;
        background: #fff;
        border-color: #13ce66;
      }
    }

    .registry-list {
      padding-bottom: 30px;

      .logo {
        font-size: 20px;
      }
    }

    .dialog-style {
      .el-dialog__body {
        padding: 0 20px;
      }
    }
  }
}
</style>
