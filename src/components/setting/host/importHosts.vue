<template>
  <div class="import-hosts-container">
    <el-alert type="warning" class="tip" :closable="false">
      <template>
        主机资源用于主机服务资源配置
        <br />详细配置可参考
        <el-link
          style="font-size: 14px; vertical-align: baseline;"
          type="primary"
          :href="`https://docs.koderover.com/zadig/settings/vm-management/`"
          :underline="false"
          target="_blank"
        >帮助文档</el-link>
      </template>
    </el-alert>
    <el-form ref="importHosts" :rules="rules" label-width="100px" label-position="left" :model="host" class="host-form">
      <el-form-item label="主机提供商" prop="provider">
        <el-select v-model="host.provider" style="width: 100%;" size="small" placeholder="请选择主机提供商">
          <el-option :value="1" label="阿里云">
            <i class="iconfont iconaliyun"></i>
            <span>阿里云</span>
          </el-option>

          <el-option :value="2" label="腾讯云">
            <i class="iconfont icontengxunyun"></i>
            <span>腾讯云</span>
          </el-option>
          <el-option :value="3" label="华为云">
            <i class="iconfont iconhuawei"></i>
            <span>华为云</span>
          </el-option>
          <el-option :value="0" label="其它">
            <i class="iconfont iconwuliji"></i>
            <span>其它</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下载模板" prop="download">
        <el-button style="width: 50%;" size="small" type="primary" @click="downloadTemplate" plain>下载模板</el-button>
      </el-form-item>
      <el-form-item label="上传文件" prop="upload">
        <el-upload
          ref="file-uploader"
          class="upload-file"
          accept=".xls, .xlsx"
          action="#"
          :limit="1"
          :auto-upload="false"
          :on-change="handleChange"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :on-remove="onRemoveFile"
        >
          <el-button :disabled="uploadBtnDisabled" style="width: 50%;" size="small" type="primary" plain>上传文件</el-button>
          <div slot="tip" class="el-upload__tip" v-html="host.msg"></div>
        </el-upload>
      </el-form-item>
      <el-form-item label="导入选项" prop="option">
        <el-radio-group v-model="host.option">
          <el-radio label="increment">
            增量
            <el-tooltip effect="dark" content="已有主机管理列表中的条目不会重新导入，仅添加文件中新增的主机信息" placement="top">
              <i class="pointer el-icon-question"></i>
            </el-tooltip>
          </el-radio>
          <el-radio label="patch">
            覆盖已有主机
            <el-tooltip effect="dark" content="已有主机管理列表中的条目重新导入且添加文件中新增的主机信息" placement="top">
              <i class="pointer el-icon-question"></i>
            </el-tooltip>
          </el-radio>
          <!-- <el-radio label="override">
            全量覆盖
            <el-tooltip effect="dark" content="已有主机管理列表中的条目不再保留，文件中的主机信息全量导入" placement="top">
              <i class="pointer el-icon-question"></i>
            </el-tooltip>
          </el-radio>-->
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import XLSX from 'xlsx'
import { importHostAPI } from '@api'
export default {
  name: 'ImportHosts',
  props: {
    originHosts: {
      type: Array,
      required: true,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      template: [
        {
          主机名称: '',
          IP: '',
          用户名: '',
          标签: '',
          'SSH 私钥': '',
          '是否生产机器(y/n)': ''
        }
      ],
      host: { provider: '', option: 'increment', msg: '只能上传 xls/xlsx 文件' },
      rules: {
        provider: [{ required: true, message: '请选择提供商', trigger: 'blur' }]
      },
      fileList: [],
      uploadBtnDisabled: false,
      fileJson: []
    }
  },
  methods: {
    async handleChange (file) {
      this.fileJson = []
      this.uploadBtnDisabled = true
      const data = await file.raw.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const fileJson = XLSX.utils.sheet_to_json(worksheet)
      if (fileJson.length > 1) {
        const invalidItems = []
        fileJson.forEach((element, index) => {
          if (!element['主机名称'] || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(element['主机名称'])) {
            invalidItems.push(index + 2)
          }
        })
        if (invalidItems.length > 0) {
          this.host.msg = `主机名称仅支持英文字母、数字、下划线且首个字符不以数字开头 <br> 第 ${invalidItems.join(',')} 行主机名称不符合需求，请检查`
        } else {
          this.host.msg = '只能上传 xls/xlsx 文件'
        }
      } else {
        this.host.msg = '模板文件不存在条目，请检查'
      }
      this.fileJson = fileJson
    },
    onRemoveFile () {
      this.uploadBtnDisabled = false
      this.fileJson = []
    },
    beforeUpload (file) {
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        return true
      } else {
        this.$message.error = '请上传 xls 或者 xlsx 类型文件'
        return false
      }
    },
    downloadTemplate () {
      const worksheet = XLSX.utils.json_to_sheet(this.template)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Zadig 主机模板')
      XLSX.writeFile(workbook, 'Zadig 主机模板.xlsx')
    },
    importHost () {
      return this.$refs.importHosts.validate().then(async () => {
        const fileJson = this.fileJson
        const provider = this.host.provider
        const option = this.host.option
        const result = fileJson.map(item => {
          return {
            name: item['主机名称'],
            provider: provider,
            label: item['标签'],
            ip: item.IP,
            is_prod: item['是否生产机器(y/n)'] === 'y',
            user_name: item['用户名'],
            private_key: window.btoa(item['SSH 私钥'])
          }
        })
        const payload = {
          option: option,
          data: result
        }
        const res = await importHostAPI(payload).catch(err => {
          console.log(err)
        })
        if (res) {
          this.host = { provider: '', option: 'increment', msg: '只能上传 xls/xlsx 文件' }
          this.$message({
            type: 'success',
            message: '导入主机信息成功'
          })
          this.$refs['file-uploader'].clearFiles()
          this.uploadBtnDisabled = false
        } else {
          return Promise.reject()
        }
      })
    }
  }
}
</script>
<style lang="less">
.import-hosts-container {
  .tip {
    margin: 15px 0;
  }

  .upload-file {
    width: 100%;

    .el-upload {
      width: 100%;
      text-align: left;
    }

    .el-upload__tip {
      line-height: 1.5;
    }

    .el-upload-list {
      .el-icon-close {
        right: 50px;
        display: inline-block;
        color: #1989fa;
      }
    }
  }
}
</style>
