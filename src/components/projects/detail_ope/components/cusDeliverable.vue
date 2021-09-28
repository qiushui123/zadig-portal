<template>
<el-dialog
  title="自定义交付物名称"
  :visible.sync="dialogVisible"
  width="60%"
  class="dialog"
  >
  <div class="content">
     <div class="title">自定义镜像名称</div>
     <div class="item" v-for="key of Object.keys(customerImage)" :key="'image'+key">
         <div class="label">{{customerImage[key].label}}</div>
         <el-input class="input1" v-model="customerImage[key].service" size="small" ></el-input> &nbsp;:&nbsp;
         <el-input class="input2" v-model="customerImage[key].value" size="small" :placeholder="customerImage[key].placeholder"></el-input>
         <span class="reset" @click="resetFiled('customerImage',key)">重置</span>
     </div>
     <div class="title">自定义 TAR 包名称</div>
     <div class="item" v-for="key of Object.keys(tar)" :key="'tar'+key">
         <div class="label">{{tar[key].label}}</div>
         <el-input class="input3" v-model="tar[key].value" size="small" :placeholder="tar[key].placeholder"></el-input>
         <span class="reset" @click="resetFiled('tar',key)">重置</span>
     </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveConfig">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
/* eslint-disable no-template-curly-in-string */
const defaultValue = '${SERVICE}'
const placeholder = ['${TIMESTAMP}-${TASK_ID}-${REPO_PR}', '${TIMESTAMP}-${TASK_ID}-${REPO_BRANCH}', '${TIMESTAMP}-${TASK_ID}-${REPO_PR}-${REPO_PR}', '${TIMESTAMP}-${REPO_TAG}']
export default {
  name: 'Deliverable',
  data () {
    return {
      dialogVisible: false,
      customerImage: {
        pr: {
          label: 'PR 生成镜像规则',
          service: defaultValue,
          value: '',
          placeholder: placeholder[0]
        },
        branch: {
          label: 'BRNACH 生成镜像规则',
          service: defaultValue,
          value: '',
          placeholder: placeholder[1]
        },
        prBranch: {
          label: 'PR + BRANCH 生成镜像规则',
          service: defaultValue,
          value: '',
          placeholder: placeholder[2]
        },
        tag: {
          label: 'TAG 生成镜像规则',
          service: defaultValue,
          value: '',
          placeholder: placeholder[3]
        }
      },
      tar: {
        pr: {
          label: 'PR 生成镜像规则',
          value: '',
          placeholder: defaultValue + '-' + placeholder[0]
        },
        branch: {
          label: 'BRNACH 生成镜像规则',
          service: defaultValue,
          value: '',
          placeholder: defaultValue + '-' + placeholder[1]
        },
        prBranch: {
          label: 'PR + BRANCH 生成镜像规则',
          value: '',
          placeholder: defaultValue + '-' + placeholder[2]
        },
        tag: {
          label: 'TAG 生成镜像规则',
          value: '',
          placeholder: defaultValue + '-' + placeholder[3]
        }
      },
      custom_image_rule: null,
      custom_tar_rule: null
    }
  },
  methods: {
    resetFiled (obj, key) {
      obj === 'customerImage' && (this[obj][key].service = defaultValue)
      this[obj][key].value = ''
    },
    saveConfig () {
      const customerImage = this.customerImage
      const tar = this.tar
      this.custom_image_rule = {
        pr_rule: (customerImage.pr.service === defaultValue && !customerImage.pr.value) ? null : `${customerImage.pr.service}-${customerImage.pr.value}`,
        branch_rule: (customerImage.branch.service === defaultValue && !customerImage.branch.value) ? null : `${customerImage.branch.service}-${customerImage.branch.value}`,
        pr_and_branch_rule: (customerImage.prBranch.service === defaultValue && !customerImage.prBranch.value) ? null : `${customerImage.prBranch.service}-${customerImage.prBranch.value}`,
        tag_rule: (customerImage.tag.service === defaultValue && !customerImage.tag.value) ? null : `${customerImage.tag.service}-${customerImage.tag.value}`
      }
      this.custom_tar_rule = {
        pr_rule: tar.pr.value,
        branch_rule: tar.branch.value,
        pr_and_branch_rule: tar.prBranch.value,
        tag_rule: tar.tag.value
      }
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.dialog {
  .content {
    padding: 10px;

    .title {
      color: #303133;
      font-size: 16px;
    }

    .item {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 10px 40px;

      .label {
        flex: 2;
      }

      .input1 {
        flex: 2;
      }

      .input2 {
        flex: 5;
      }

      .input3 {
        flex: 7;
      }

      .reset {
        margin-left: 10px;
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}

</style>
