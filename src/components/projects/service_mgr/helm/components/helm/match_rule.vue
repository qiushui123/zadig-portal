<template>
  <el-drawer title="设置匹配规则" :visible.sync="updateMatchRule" :wrapperClosable="false" class="match-rule-container" size="450px">
    <ul class="tooltip">
      <li>系统会解析镜像名为服务组件</li>
      <li>项目范围内匹配规则全局生效</li>
    </ul>
    <div class="mr-content" v-loading="pageLoading">
      <div class="mr-title">系统内置规则</div>
      <div class="inner-rule">
        <el-checkbox v-model="systemMatchRules[0].inUse"></el-checkbox>
        <div class="rule">
          格式一：
          <br />&nbsp;&nbsp;image:
          <br />&nbsp;&nbsp;&nbsp;&nbsp;repository: 仓库地址/命名空间/镜像名
          <br />&nbsp;&nbsp;&nbsp;&nbsp;tag: 标签名
          <br />
        </div>
      </div>
      <div class="inner-rule">
        <el-checkbox v-model="systemMatchRules[1].inUse"></el-checkbox>
        <div class="rule">
          格式二：
          <br />&nbsp;&nbsp;image: 仓库地址/命名空间/镜像名:标签名
          <br />
        </div>
      </div>
      <div class="mr-title">自定义规则</div>
      <div v-for="(rule,index) in matchRules" :key="index">
        <div v-if="!rule.presetId" class="custom-rule">
          <el-checkbox v-model="rule.inUse"></el-checkbox>
          <span class="rule">{{ showRule(rule) }}</span>
          <el-button type="text" @click="deleteCustomRule(index)">删除</el-button>
        </div>
      </div>
      <div>
        <el-form ref="ruleForm" :model="customRule" :rules="rules">
          <el-row :gutter="5">
            <el-col :span="10">
              <el-form-item prop="repo">
                <el-input v-model="customRule.repo" placeholder="仓库地址/命名空间" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="separator">/</el-col>
            <el-col :span="6">
              <el-form-item prop="image">
                <el-input v-model="customRule.image" placeholder="镜像名" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="separator">:</el-col>
            <el-col :span="6">
              <el-form-item prop="tag">
                <el-input v-model="customRule.tag" placeholder="标签名" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button type="text" @click="addMatchRule">添加</el-button>
      </div>
      <div class="example-rule">
        <div class="er-title">示例：</div>
        <div class="er-title">values 文件：</div>
        <div class="rule border">
          &nbsp;&nbsp;deploy:
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;image:
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;repo: library
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: ubuntu
          <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;tag: 12.04
        </div>
        <div class="er-title">自定义规则：</div>
        <div class="rule">
          <span class="gray-bg">deploy.image.repo</span>
          <span>/</span>
          <span class="gray-bg">deploy.image.name</span>
          <span>:</span>
          <span class="gray-bg">deploy.image.tag</span>
        </div>
      </div>
    </div>
    <div class="mr-footer">
      <el-button type="primary" :loading="addLoading" @click="updateMatchRules" plain>保存</el-button>
      <span class="tootip">保存规则且重新匹配服务组件</span>
    </div>
  </el-drawer>
</template>

<script>
import { updateMatchRulesAPI, getMatchRulesAPI } from '@api'
import { orderBy, cloneDeep } from 'lodash'
export default {
  name: 'MatchRule',
  data () {
    this.rules = {
      image: [{ required: true, message: '镜像名称不能为空', trigger: 'blur' }]
    }
    return {
      selectedList: [],
      matchRules: [
        {
          repo: '',
          image: 'image.repository',
          tag: 'image.tag',
          inUse: true,
          presetId: 1
        },
        {
          repo: '',
          image: 'image',
          tag: '',
          inUse: true,
          presetId: 2
        }
      ],
      customRule: {
        repo: '',
        image: '',
        tag: '',
        inUse: true
      },
      pageLoading: true,
      addLoading: false
    }
  },
  props: {
    value: Boolean
  },
  computed: {
    projectName () {
      return this.$route.params.project_name
    },
    serviceName () {
      return this.$route.query.service_name
    },
    updateMatchRule: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('update:value', val)
      }
    },
    systemMatchRules () {
      return orderBy(
        this.matchRules.filter(rule => rule.presetId),
        ['presetId']
      )
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.getMatchRules()
      }
    }
  },
  methods: {
    showRule ({ repo, image, tag }) {
      let res = repo
      if (image) {
        res = res ? `${res}/${image}` : image
      }
      if (tag) {
        res += ':' + tag
      }
      return res
    },
    deleteCustomRule (index) {
      this.matchRules.splice(index, 1)
    },
    addMatchRule () {
      this.$refs.ruleForm.validate().then(res => {
        this.matchRules.push(cloneDeep(this.customRule))
        this.$refs.ruleForm.resetFields()
      })
    },
    getMatchRules () {
      this.pageLoading = true
      getMatchRulesAPI(this.projectName)
        .then(res => {
          this.matchRules = res
          this.pageLoading = false
        })
        .catch(err => {
          console.log(err)
          this.pageLoading = false
        })
    },
    updateMatchRules () {
      this.addLoading = true
      updateMatchRulesAPI(this.projectName, { rules: this.matchRules })
        .then(res => {
          this.$message.success(`更新规则成功！`)
          this.updateMatchRule = false
          this.addLoading = false
          this.serviceName &&
            this.$store.dispatch('queryServiceModule', {
              projectName: this.projectName,
              serviceName: this.serviceName
            })
        })
        .catch(err => {
          console.log(err)
          this.$message.error(`更新规则失败！`)
          this.addLoading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.match-rule-container {
  /deep/.el-drawer__header {
    margin-bottom: 25px;
  }

  /deep/.el-drawer__body {
    height: 100%;
    padding: 0 20px;
    overflow: auto;
  }

  .tooltip {
    margin-bottom: 10px;
    margin-left: 10px;
    color: #e6a23c;
    font-size: 14px;
    line-height: 1.5;
    list-style: decimal inside;
  }

  .mr-content {
    margin-bottom: 60px;
    color: #606266;
    font-size: 14px;

    .mr-title {
      padding: 10px 0;
      color: #909399;
      font-weight: bold;
      font-size: 15px;
      line-height: 1;
    }

    .inner-rule {
      display: flex;
      padding: 5px 0;

      .rule {
        padding-left: 10px;
        line-height: 1.5;
      }
    }

    .example-rule {
      padding: 5px 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      box-shadow: 0 0 5px 2px #eee;

      .border {
        padding: 5px;
        background: #eee;
        border-radius: 5px;
      }

      .er-title {
        padding: 8px 0;
      }

      .rule {
        margin-bottom: 10px;
        padding-left: 5px;
        line-height: 1.5;

        .gray-bg {
          background: #eee;
        }
      }
    }

    .custom-rule {
      display: flex;
      align-items: center;

      .rule {
        flex: 1 0 auto;
        box-sizing: border-box;
        width: 90%;
        padding: 0 10px;
        word-break: break-all;
      }
    }

    .separator {
      height: 40px;
      line-height: 40px;
      text-align: center;
    }

    /deep/.el-form {
      margin-top: 20px;

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .mr-footer {
    position: absolute;
    bottom: 10px;
    left: 20px;

    .tootip {
      margin-bottom: 10px;
      margin-left: 10px;
      color: #409eff;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}
</style>
