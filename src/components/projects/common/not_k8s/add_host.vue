<template>
  <div>
    <el-alert type="warning"
              :closable="false">
      <template>
        主机资源用于物理机服务资源配置<br />
        详细配置可参考
        <el-link style="font-size: 14px; vertical-align: baseline;"
                 type="primary"
                 :href="`https://docs.koderover.com/zadig/settings/vm-management/`"
                 :underline="false"
                 target="_blank">帮助文档</el-link>
      </template>
    </el-alert>
    <el-form ref="host"
             :rules="rules"
             label-width="120px"
             label-position="left"
             :model="host"
             class="host-form">
      <el-form-item label="主机名称"
                    prop="name">
        <el-input size="small"
                  v-model="host.name"
                  placeholder="请输入主机名称"></el-input>
      </el-form-item>
      <el-form-item label="主机提供商"
                    prop="provider">
        <el-select v-model="host.provider"
                   style="width: 100%;"
                   size="small"
                   placeholder="请选择主机提供商">
          <el-option :value="1"
                     label="阿里云">
            <i class="iconfont iconaliyun"></i> <span>阿里云</span>
          </el-option>

          <el-option :value="2"
                     label="腾讯云">
            <i class="iconfont icontengxunyun"></i> <span>腾讯云</span>
          </el-option>
          <el-option :value="3"
                     label="华为云">
            <i class="iconfont iconhuawei"></i> <span>华为云</span>
          </el-option>
          <el-option :value="0"
                     label="其它">
            <i class="iconfont iconqita"></i> <span>其它</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户名"
                    prop="user_name">
        <el-input size="small"
                  v-model="host.user_name"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="IP 地址"
                    prop="ip">
        <el-input size="small"
                  v-model="host.ip"
                  placeholder="请输入主机 IP"></el-input>
      </el-form-item>
      <el-form-item label="标签"
                    prop="label">
        <el-input size="small"
                  v-model="host.label"
                  placeholder="请输入标签"></el-input>
      </el-form-item>
      <el-form-item label="是否生产"
                    prop="is_prod">
        <el-radio-group v-model="host.is_prod">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="私钥"
                    prop="private_key">
        <el-input size="small"
                  type="textarea"
                  v-model="host.private_key"
                  placeholder="请输入私钥"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createHostAPI, updateHostAPI } from '@api'
export default {
  props: {
    host: {
      type: Object,
      default () {
        return {
          name: '',
          provider: null,
          label: '',
          ip: '',
          user_name: '',
          private_key: ''
        }
      }
    }
  },
  data () {
    return {
      rules: {
        name: [{
          type: 'string',
          required: true,
          message: '请输入主机名称',
          trigger: 'change'
        }],
        provider: [{ required: true, message: '请选择提供商', trigger: 'blur' }],
        label: [{
          type: 'string',
          required: false,
          message: '请输入主机标签',
          trigger: 'change'
        }],
        user_name: [{
          type: 'string',
          required: true,
          message: '请输入用户名'
        }],
        ip: [{
          type: 'string',
          required: true,
          message: '请输入主机 IP'
        }],
        private_key: [{
          type: 'string',
          required: true,
          message: '请输入私钥'
        }]
      }
    }
  },
  methods: {
    saveHost () {
      return this.$refs.host.validate()
        .then(async () => {
          const payload = this.host
          payload.private_key = window.btoa(payload.private_key)
          const res = await createHostAPI(payload)
          if (res) {
            this.$refs.host.resetFields()
            this.$message({
              type: 'success',
              message: '新增主机信息成功'
            })
          } else {
            return Promise.reject()
          }
        })
    },
    updateHost () {
      return this.$refs.host.validate()
        .then(async () => {
          const id = this.host.id
          const payload = this.host
          payload.private_key = window.btoa(payload.private_key)
          delete payload.origin_private_key
          const res = await updateHostAPI(id, payload)
          if (res) {
            this.$refs.host.resetFields()
            this.$message({
              type: 'success',
              message: '更新主机信息成功'
            })
          } else {
            return Promise.reject()
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.host-form {
  padding: 30px 20px;
}
</style>