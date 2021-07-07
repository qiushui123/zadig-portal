<template>
  <div>
    <div v-show="currentStep === 1">
      <div class="title">找回密码</div>
      <div class="des">验证码将会发送至您的注册邮箱</div>
      <el-form :model="retrieveForm" :rules="retrieveRules" ref="retrieveForm">
        <el-form-item prop="email">
          <el-input v-model="retrieveForm.email" placeholder="邮箱"> </el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="submit"
        class="btn-md btn-theme btn-block login-btn"
        @click="nextStep"
      >
        下一步
      </el-button>
    </div>
    <div v-show="currentStep === 2">
      <div class="title">设置新密码</div>
      <div class="des">新密码应不小于 8 位字符</div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="新密码"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input
            type="password"
            v-model="form.checkPass"
            placeholder="再次输入新密码"
            show-password
            :minlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <el-input
            v-model="form.captcha"
            placeholder="请输入邮箱验证码"
            :minlength="8"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="submit"
        @click="submit"
        class="btn-md btn-theme btn-block login-btn"
      >
        重置密码
      </el-button>
    </div>
  </div>
</template>
<script>
import { retrievePassword, changePassword } from '@api'
export default {
  name: 'forgetpassword',
  props: {
    openLogin: Function
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else if (value.length < 8) {
        callback(new Error('新密码应不小于 8 位字符'))
      } else {
        if (this.form.checkPass) {
          this.$refs.form.validateField('checkPass')
        }
        callback()
      }
    }
    const validateConfirmedPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'))
      } else if (value.length < 8) {
        callback(new Error('新密码应不小于 8 位字符'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        password: null,
        checkPass: null,
        captcha: null,
        email: null
      },
      retrieveForm: {
        email: null
      },
      currentStep: 1,
      retrieveRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      },
      rules: {
        password: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validateConfirmedPass, trigger: 'change' }],
        captcha: [{ required: true, message: '请输入邮箱验证码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    nextStep () {
      this.$refs.retrieveForm.validate(async (valid) => {
        if (valid) {
          const res = await retrievePassword(this.retrieveForm).catch((error) =>
            console.log(error)
          )
          if (res) {
            this.currentStep = 2
            if (res.resultCode === 10018) {
              this.$message.error('验证码未过期,请查看邮件获取')
            }
          }
        }
      })
    },
    async submit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.form.email = this.retrieveForm.email
          const res = await changePassword(this.form).catch((error) =>
            console.log(error)
          )
          if (res) {
            this.$message.success('重置成功')
            this.openLogin()
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  color: #303133;
  font-weight: 600;
  font-size: 24px;
  text-align: left;
}

.des {
  margin: 20px 0;
  color: #717171;
  text-align: left;
}

.btn-theme {
  color: #fff;
  background: #376bff;
  border: none;
}

.input {
  background: #fff !important;
}

.btn-theme:hover {
  background: #2c5ce4;
}

.btn-md {
  width: 100%;
  padding: 12px 30px 11px 30px;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 1px;
  border-radius: 50px;
  cursor: pointer;
}

/deep/ .el-input-group__append {
  background-color: rgb(232, 240, 254);
  cursor: pointer;
}
</style>
