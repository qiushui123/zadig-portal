<template>
  <div
       class="pipeline-workflow__column pipeline-workflow__column_left pipeline-workflow__column--w100p">
    <div class="white-box-with-shadow">
        <div class="white-box-with-shadow__content">
          <div class="row cf-pipeline-yml-build__wrapper">
            <div class="cf-pipeline-yml-build__editor cf-pipeline-yml-build__editor_inline">
              <div
                   class="cf-pipeline-yml-build__editor-wrapper"
                   @keydown.meta.83.prevent="updateServiceByKeyword">
                <codemirror style="width: 100%; height: 100%;"
                            ref="myCm"
                            :value="file.content"
                            :options="cmOptions"
                            @input="onCmCodeChange">
                </codemirror>
              </div>
            </div>
          </div>

        </div>
        <div
             class="controls__wrap">
          <div class="controls__right">
            <el-button type="primary"
                       size="small"
                       :disabled="disabledSave || !fileChange"
                       @click="updateFile">保存</el-button>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
import { debounce } from 'lodash'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/dockerfile/dockerfile'
import 'codemirror/theme/neo.css'
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.css'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/jump-to-line.js'

import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import { validateYamlAPI, getDockerfileAPI, createDockerfileTemplateAPI, updateDockerfileTemplateAPI } from '@api'
const parser = require('docker-file-parser')

export default {
  props: {
    fileInTree: {
      type: Object,
      required: true
    },
    fileChange: Boolean
  },
  data () {
    return {
      // codemirror options
      cmOptions: {
        tabSize: 5,
        readOnly: false,
        theme: 'neo',
        mode: 'text/x-dockerfile',
        lineNumbers: true,
        line: true,
        collapseIdentical: true
      },
      errors: [],
      info: { message: '' },
      file: {
        content: ''
      },
      stagedFile: {},
      initFileContent: '',
      mockRes: [{
        id: 'd1',
        name: 'dockerfile 1',
        content: '# Dockerfile 1 Install Ghost\n'
      },
      {
        id: 'd2',
        name: 'dockerfile 2',
        content: '# Dockerfile 2 Install Ghost\n'
      }],
      newCode: ''
    }
  },
  methods: {
    keepInitFileContent (newContent) {
      this.initFileContent = newContent
      this.$emit('update:fileChange', this.initFileContent !== this.file.content)
    },
    async getFile (val) {
      const id = val ? val.id : null
      const status = val.status
      if (id && status === 'added') {
        const res = await getDockerfileAPI(
          id
        ).catch(err => {
          console.log(err)
        })
        if (res) {
          this.file = res
          this.keepInitFileContent(res.content)
        }
      }
    },
    updateServiceByKeyword () {
      const cantSave = this.disabledSave || !this.fileChange
      if (cantSave) {
        return
      }
      this.updateFile()
    },
    async updateFile () {
      const fileName = this.file.name
      const fileId = this.file.id
      const content = this.file.content
      const status = this.fileStatus
      const payload = {
        name: fileName,
        content: content
      }
      if (status === 'added') {
        const res = await updateDockerfileTemplateAPI(
          fileId, payload
        ).catch(err => {
          console.log(err)
        })
        if (res) {
          this.keepInitFileContent(content)
          this.$emit('onUpdateFile', { name: fileName, status: this.file.status, payload })
          this.$message({
            type: 'success',
            message: `模板 ${fileName}更新成功`
          })
        }
      } else if (status === 'named') {
        const res = await createDockerfileTemplateAPI(payload
        ).catch(err => {
          console.log(err)
        })
        if (res) {
          this.keepInitFileContent(content)
          this.$emit('onUpdateFile', { name: fileName, status: this.file.status, payload })
          this.$message({
            type: 'success',
            message: `模板 ${fileName} 创建成功`
          })
        }
      }
    },
    onCmCodeChange: debounce(function (newCode) {
      this.errors = []
      this.file.content = newCode
      this.$emit('update:fileChange', this.initFileContent !== newCode)
      if (this.file.content) {
        this.validateFile(newCode)
        if (this.file.status === 'named') {
          this.stagedFile[this.file.name] = newCode
        }
      }
    }, 100),
    validateFile (code) {
      const options = { includeComments: false }
      console.log(parser.parse(code, options))
      // validateYamlAPI().then((res) => {
      //   if (res && res.length > 0) {
      //     this.errors = res
      //   } else if (res && res.length === 0) {
      //     this.errors = []
      //   }
      // })
    },
    editorFocus () {
      this.codemirror.focus()
    }
  },
  computed: {
    codemirror () {
      return this.$refs.myCm.codemirror
    },
    fileName () {
      return this.fileInTree.name
    },
    fileId () {
      return this.fileInTree.id
    },
    fileStatus () {
      return this.fileInTree.status
    },
    disabledSave () {
      return this.errors.length > 0
    }
  },
  watch: {
    fileInTree: {
      handler (val, old_val) {
        if (val.status === 'added') {
          this.getFile(val)
        } else if (val.status === 'named') {
          this.file = {
            content: '',
            name: val.name,
            status: 'named'
          }
          this.initFileContent = ''
          this.$emit('update:fileChange', this.initFileContent !== this.file.content)
          if (this.stagedFile[val.name]) {
            this.file.content = this.stagedFile[val.name]
          }
          this.$refs.myCm && this.editorFocus()
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.editorFocus()
  },
  components: {
    codemirror
  }
}
</script>
<style lang="less">
@import "~@assets/css/component/file-editor.less";
</style>
