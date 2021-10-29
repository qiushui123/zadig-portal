<template>
  <div class="inte-registry">
    <el-alert type="warning">
      <div>
        镜像仓库集成可参考
        <el-link type="warning"
                 style="font-weight: 600;"
                 :href="`https://docs.koderover.com/zadig/settings/image-registry/`"
                 :underline="false"
                 target="_blank">
          这里
        </el-link>
        ！
      </div>
    </el-alert>
    <div class="content">
      <el-form ref="registry"
               :rules="rules"
               label-width="110px"
               label-position="top"
               :model="registry">
        <el-form-item label="默认使用"
                      prop="is_default">
          <el-checkbox v-model="registry.is_default"></el-checkbox>
        </el-form-item>
        <el-form-item label="提供商"
                      prop="reg_provider">
          <el-select v-model="registry.reg_provider"
                     style="width: 100%;"
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
          <el-input clearable
                    v-model="registry.region"></el-input>
        </el-form-item>
        <el-form-item label="地址"
                      prop="reg_addr">
          <el-input clearable
                    v-model="registry.reg_addr"></el-input>
        </el-form-item>
        <el-form-item prop="namespace">
          <template slot="label">
            {{ registry.reg_provider ? providerMap[registry.reg_provider].namespace : 'Namespace' }}
          </template>
          <el-input clearable
                    v-model="registry.namespace"></el-input>
        </el-form-item>
        <el-form-item :label="registry.reg_provider === 'swr'?'Access Key':'Docker 用户名'"
                      :rules="{ required: true, message: `请输入 ${registry.reg_provider === 'swr'?'Access Key':'Docker 用户名'}`, trigger: 'blur' }"
                      prop="access_key">
          <el-input clearable
                    v-model="registry.access_key"></el-input>
        </el-form-item>
        <el-form-item :label="registry.reg_provider === 'swr'?'Secret Key':'Docker 密码'"
                      :rules="{ required: true, message: `请输入 ${registry.reg_provider === 'swr'?'Secret Key':'Docker 密码'}`, trigger: 'blur' }"
                      prop="secret_key">
          <el-input clearable
                    type="passsword"
                    v-model="registry.secret_key"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button :plain="true"
                   type="success"
                   size="small"
                   @click="registryOperation">保存</el-button>
        <el-button @click="$emit('cancel')"
                   size="small">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createRegistryAPI } from '@api'
export default {
  name: 'IntegrationRegistry',
  data () {
    return {
      registry: {
        namespace: '',
        reg_addr: '',
        access_key: '',
        secret_key: '',
        reg_provider: '',
        region: '',
        is_default: true
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
  methods: {
    getProviderMap (name, type) {
      if (this.providerMap[name] && type) {
        return this.providerMap[name][type]
      } else {
        return this.providerMap.native.icon
      }
    },
    registryOperation () {
      this.$refs.registry.validate(valid => {
        if (valid) {
          const payload = this.registry
          createRegistryAPI(payload).then((res) => {
            this.$message({
              type: 'success',
              message: '新增成功'
            })
            this.$emit('cancel')
            this.$emit('createSuccess')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.inte-registry {
  padding: 10px 15px;
  font-size: 13px;

  .content {
    padding: 30px 20px;

    /deep/ .el-form-item {
      margin-bottom: 10px;

      &:first-child .el-form-item__content {
        top: -4px;
        display: inline-block;
        padding-left: 30px;
      }
    }
  }

  .footer {
    padding-top: 20px;
  }
}
</style>
