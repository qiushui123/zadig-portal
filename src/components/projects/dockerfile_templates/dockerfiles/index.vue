<template>
    <div class="dockerfile-template-container">
      <div class="pipeline">
        <div class="pipeline-workflow__wrap">
          <multipane class="vertical-panes"
                     layout="vertical">
            <div class="file-tree-container">
              <fileTree :files="files"
                           :showNext.sync="showNext"
                           :fileChange="fileChange"
                           ref="fileTree"
                           @onRefreshFile="getFiles"
                           @onSelectFileChange="onSelectFileChange"
                           @updateFile="updateFile($event)"></fileTree>
            </div>
            <template v-if="files.length >0">
              <template>
                <multipane-resizer></multipane-resizer>
                <div class="file-editor-container"
                     :style="{ minWidth: '300px', width: '500px' }">
                  <fileEditor ref="fileEditor"
                                    :fileInTree="file"
                                    :showNext.sync="showNext"
                                    :fileChange.sync="fileChange"
                                    @onRefreshFile="getFiles"
                                    @onUpdateFile="onUpdateFile"></fileEditor>
                </div>
                <multipane-resizer></multipane-resizer>
                <aside class="pipelines__aside pipelines__aside_right"
                       :style="{ flexGrow: 1 }">
                  <FileAside :file="file"
                                   :detectedEnvs="detectedEnvs"
                                   @getServiceModules="getServiceModules"> </FileAside>
                </aside>

              </template>
            </template>
            <div v-else
                 class="no-content">
              <img src="@assets/icons/illustration/editor_nodata.svg"
                   alt="">
              <p v-if="files.length === 0">暂无模板，点击 <el-button size="mini"
                           icon="el-icon-plus"
                           @click="createFile()"
                           plain
                           circle>
                </el-button> 创建模板</p>
              <p v-else-if="file.name==='模板列表' && files.length >0">请在左侧选择需要编辑的模板</p>
              <p v-else-if="!file.name && files.length >0">请在左侧选择需要编辑的模板</p>
            </div>
          </multipane>
        </div>
      </div>
    </div>
</template>
<script>
import mixin from '@utils/service_module_mixin'
import FileAside from './file_aside.vue'
import fileEditor from './file_editor.vue'
import fileTree from './file_tree.vue'
import { sortBy } from 'lodash'
import bus from '@utils/event_bus'
import {
  getDockerfileTemplatesAPI,
  getDockerfileAPI
} from '@api'
import { Multipane, MultipaneResizer } from 'vue-multipane'
export default {
  data () {
    return {
      file: {},
      files: [],
      detectedEnvs: [],
      detectedServices: [],
      systemEnvs: [],
      showNext: false,
      fileChange: false
    }
  },
  methods: {
    createFile () {
      this.$refs.fileTree.createFile()
    },
    onSelectFileChange (file) {
      this.$set(this, 'file', file)
    },
    getFiles () {
      this.$set(this, 'file', {})
      getDockerfileTemplatesAPI().then((res) => {
        this.files = sortBy((res.dockerfile_template.map(file => {
          file.status = 'added'
          return file
        })), 'name')
      })
    },
    getServiceModules () {
      const fileName = this.file.name
      const projectName = this.projectName
      serviceTemplateWithConfigAPI(fileName, projectName).then(res => {
        this.detectedEnvs = res.custom_variable ? res.custom_variable : []
        this.detectedServices = res.service_module ? res.service_module : []
        this.systemEnvs = res.system_variable ? res.system_variable : []
      })
    },
    onUpdateFile ({ name, status, res }) {
      this.showNext = true
      this.$router.replace({
        query: Object.assign(
          {},
          {},
          {
            name: name,
            rightbar: 'var'
          })
      })
      if (status === 'named') {
        this.getFiles()
      }
    },
    updateFile (switchNode) {
      this.$refs.fileEditor.updateFile().then(() => {
        if (switchNode) {
          this.$refs.fileTree.selectAndSwitchTreeNode()
        }
      })
    }
  },
  computed: {
    fileName () {
      return this.$route.query.name
    }
  },
  watch: {

  },
  mounted () {
    bus.$emit('set-topbar-title', { title: 'Dockerfile 模板库', breadcrumb: [] })
    this.getFiles()
  },
  components: {
    FileAside,
    fileEditor,
    fileTree,
    Multipane,
    MultipaneResizer
  },
  mixins: [mixin]
}
</script>

<style lang="less">
@import "~@assets/css/component/dockerfile-template.less";
</style>
