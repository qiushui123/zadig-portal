<template>
  <div class="add-code-container">
    <el-alert title="检测到代码源尚未集成请先集成代码源后再进行添加构建操作"
              :closable="false"
              type="warning">
    </el-alert>
    <el-alert v-if="codeAdd.type === 'codehub'"
              type="info"
              :closable="false">
      <slot>
        <span class="tips">点击
          <el-link style="font-size: 14px; vertical-align: baseline;"
                   type="primary"
                   href="https://support.huaweicloud.com/devg-apisign/api-sign-provide-aksk.html"
                   :underline="false"
                   target="_blank">帮助</el-link> 查看如何获取 Access Key 和 Secret Key
        </span>
        <span class="tips">点击
          <el-link style="font-size: 14px; vertical-align: baseline;"
                   type="primary"
                   href="https://support.huaweicloud.com/usermanual-codehub/codehub_ug_8003.html"
                   :underline="false"
                   target="_blank">帮助</el-link> 查看如何获取用户名和密码
        </span>
      </slot>
    </el-alert>
    <el-alert v-else
              type="info"
              :closable="false">
      <slot>
        <span class="tips">{{`- 应用授权的回调地址请填写:`}}</span>
        <span class="tips code-line">
          {{`${$utils.getOrigin()}/api/directory/codehosts/callback`}}
          <span v-clipboard:copy="`${$utils.getOrigin()}/api/directory/codehosts/callback`"
                v-clipboard:success="copyCommandSuccess"
                v-clipboard:error="copyCommandError"
                class="el-icon-document-copy copy"></span>
        </span>
        <span class="tips">- 应用权限请勾选：api、read_user、read_repository</span>
        <span class="tips">- 其它配置可以点击
          <el-link style="font-size: 13px;"
                   type="primary"
                   :href="`https://docs.koderover.com/zadig/settings/codehost/gitlab/`"
                   :underline="false"
                   target="_blank">帮助</el-link> 查看配置样例
        </span>
      </slot>
    </el-alert>
    <el-form :model="codeAdd"
             :rules="codeRules"
             status-icon
             label-position="top"
             ref="codeForm">
      <el-form-item label="代码源"
                    prop="type">
        <el-select style="width: 100%;"
                   v-model="codeAdd.type">
          <el-option label="GitLab"
                     value="gitlab"></el-option>
          <el-option label="GitHub"
                     value="github"></el-option>
          <el-option label="CodeHub"
                     value="codehub"></el-option>
          <el-option label="Gerrit"
                     value="gerrit"></el-option>
        </el-select>
      </el-form-item>
      <template v-if="codeAdd.type==='gitlab'||codeAdd.type==='github'">
        <el-form-item v-if="codeAdd.type==='gitlab'"
                      label="GitLab 服务 URL"
                      prop="address">
          <el-input v-model="codeAdd.address"
                    placeholder="GitLab 服务 URL"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="codeAdd.type==='gitlab'?'Application ID':'Client ID'"
                      prop="applicationId">
          <el-input v-model="codeAdd.applicationId"
                    :placeholder="codeAdd.type==='gitlab'?'Application ID':'Client ID'"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="codeAdd.type==='gitlab'?'Secret':'Client Secret'"
                      prop="clientSecret">
          <el-input v-model="codeAdd.clientSecret"
                    :placeholder="codeAdd.type==='gitlab'?'Secret':'Client Secret'"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="codeAdd.type==='github'"
                      label="Organization"
                      prop="namespace">
          <el-input v-model="codeAdd.namespace"
                    placeholder="Organization"
                    auto-complete="off"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="codeAdd.type==='gerrit'">
        <el-form-item label="Gerrit 服务 URL"
                      prop="address">
          <el-input v-model="codeAdd.address"
                    placeholder="Gerrit 服务 URL"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名"
                      prop="username">
          <el-input v-model="codeAdd.username"
                    placeholder="Username"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input v-model="codeAdd.password"
                    placeholder="Password"
                    auto-complete="off"></el-input>
        </el-form-item>
      </template>
      <template v-else-if="codeAdd.type==='codehub'">
        <el-form-item label="CodeHub 服务 URL"
                      prop="address">
          <el-input v-model="codeAdd.address"
                    placeholder="CodeHub 服务 URL"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="区域"
                      prop="region">
          <el-input v-model="codeAdd.region"
                    placeholder="区域"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :rules="{required: true,message: '请填写 Access Key',trigger: ['blur']}"
                      label="Access Key"
                      prop="applicationId">
          <el-input v-model="codeAdd.applicationId"
                    placeholder="Access Key"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :rules="{required: true,message: '请填写 Secret Key',trigger: ['blur']}"
                      label="Secret Key"
                      prop="clientSecret">
          <el-input v-model="codeAdd.clientSecret"
                    placeholder="Secret Key"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :rules="{required: true,message: '请填写用户名',trigger: ['blur']}"
                      label="用户名"
                      prop="username">
          <el-input v-model="codeAdd.username"
                    placeholder="用户名"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :rules="{required: true,message: '请填写密码',trigger: ['blur']}"
                      label="密码"
                      prop="password">
          <el-input v-model="codeAdd.password"
                    placeholder="密码"
                    auto-complete="off"></el-input>
        </el-form-item>

      </template>
    </el-form>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 native-type="submit"
                 size="small"
                 class="start-create"
                 @click="createCodeConfig">
        {{(codeAdd.type==='gerrit'||codeAdd.type==='codehub')?'确定':'前往授权'}}</el-button>
      <el-button plain
                 native-type="submit"
                 size="small"
                 @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import {
  createCodeSourceAPI
} from '@api'
const validateGitURL = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入服务 URL'))
  } else {
    if (value.endsWith('/')) {
      callback(new Error('URL 末尾不能包含 /'))
    } else {
      callback()
    }
  }
}
export default {
  data () {
    return {
      codeAdd: {
        name: '',
        namespace: '',
        region: '',
        type: 'gitlab',
        address: '',
        accessToken: '',
        applicationId: '',
        clientSecret: ''
      },
      codeRules: {
        type: {
          required: true,
          message: '请选择代码源类型',
          trigger: ['blur']
        },
        address: [{
          type: 'url',
          message: '请输入正确的 URL，包含协议',
          trigger: ['blur', 'change']
        }, {
          required: true,
          trigger: 'change',
          validator: validateGitURL
        }],
        accessToken: {
          required: true,
          message: '请填写 Access Token',
          trigger: ['blur']
        },
        applicationId: {
          required: true,
          message: '请填写 Id',
          trigger: ['blur']
        },
        clientSecret: {
          required: true,
          message: '请填写 Secret',
          trigger: ['blur']
        },
        region: {
          required: true,
          message: '请填写区域',
          trigger: ['blur']
        },
        namespace: {
          required: true,
          message: '请填写 Org',
          trigger: ['blur']
        },
        username: {
          required: true,
          message: '请填写 Username',
          trigger: ['blur']
        },
        password: {
          required: true,
          message: '请填写 Password',
          trigger: ['blur']
        }
      }
    }
  },
  methods: {
    clearValidate (ref) {
      this.$refs[ref].clearValidate()
    },
    cancel () {
      this.$emit('cancel', true)
    },
    createCodeConfig () {
      this.$refs.codeForm.validate((valid) => {
        if (valid) {
          const payload = this.codeAdd
          const redirect_url = window.location.href.split('?')[0]
          const provider = this.codeAdd.type
          createCodeSourceAPI(payload).then((res) => {
            const code_source_id = res.id
            this.$message({
              message: '代码源添加成功',
              type: 'success'
            })
            if (payload.type === 'gitlab' || payload.type === 'github') {
              this.goToCodeHostAuth(code_source_id, redirect_url, provider)
            }
            this.handleCodeCancel()
          })
        } else {
          return false
        }
      })
    },
    goToCodeHostAuth (code_source_id, redirect_url, provider) {
      window.location.href = `/api/directory/codehostss/${code_source_id}/auth?redirect=${redirect_url}&provider=${provider}`
    },
    copyCommandSuccess (event) {
      this.$message({
        message: '地址已成功复制到剪贴板',
        type: 'success'
      })
    },
    copyCommandError (event) {
      this.$message({
        message: '地址复制失败',
        type: 'error'
      })
    }
  },
  watch: {
    'codeAdd.type' (val) {
      this.$refs.codeForm.clearValidate()
    }
  }
}
</script>
<style lang="less">
.add-code-container {
  padding: 10px 15px;
  font-size: 13px;

  .tips {
    display: block;

    &.code-line {
      display: inline-block;
      padding-left: 10px;
      color: #ecf0f1;
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
      background-color: #334851;
      border-radius: 2px;

      .copy {
        font-size: 16px;
        cursor: pointer;

        &:hover {
          color: #13ce66;
        }
      }
    }
  }
}
</style>
