<template>
    <div >
      <el-form-item label="服务">
        <el-select v-model="pickedTargetServices"
                   @change="getArtifactFile"
                   value-key="key"
                   filterable
                   multiple
                   clearable
                   size="medium"
                   class="full-width">
          <el-option v-for="(ser,index) of allServices"
                     :key="index"
                     :label="ser.name"
                     :value="ser">
            <span>
              <span>{{ser.name}}</span><span style="color: #ccc;"> ({{ser.service_name}})</span>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对象存储" >
        <el-select v-model="pickedStorage"
                   filterable
                   clearable
                   @change="changeStorage"
                   size="medium"
                   class="full-width">
          <el-option v-for="(item,index) of objectstorageList"
                     :key="index"
                     :label="`${item.bucket}(${item.endpoint})`"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-table v-if="pickedTargetServices.length > 0"
                :data="pickedTargetServices"
                empty-text="无"
                class="service-deploy-table">
        <el-table-column prop="name"
                         label="服务"
                         width="150px">
        </el-table-column>
        <el-table-column label="交付物">
          <template slot-scope="scope">
            <div class="workflow-build-rows">
              <el-row class="build-row">
                <template>
                  <el-col :span="12">
                    <!-- 绑定元数据 -->
                    <el-select v-if="tarFileMap[scope.row.name] && tarFileMap[scope.row.name].length > 0"
                               v-model="scope.row.file"
                               @visible-change="changeVirtualData($event, scope.row, scope.$index)"
                               filterable
                               clearable
                               value-key="file_name"
                               size="small"
                               style="width: 100%;"
                               placeholder="请选择交付物">
                      <virtual-scroll-list :ref="`scrollListRef${scope.$index}`"
                                           style="height: 272px; overflow-y: auto;"
                                           :size="virtualData.size"
                                           :keeps="virtualData.keeps"
                                           :start="startAll[scope.row.name]"
                                           :dataKey="'file_name'"
                                           :dataSources="tarFileMap[scope.row.name]"
                                           :dataComponent="itemComponent">
                      </virtual-scroll-list>
                    </el-select>
                    <el-tooltip v-else
                                content="请求交付物失败，请手动输入交付物信息"
                                placement="top"
                                popper-class="gray-popper">
                      <el-input v-model="scope.row.file_name"
                                class="short-input"
                                size="small"
                                placeholder="请填写交付物信息"></el-input>
                    </el-tooltip>
                  </el-col>
                </template>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>
<script>
import virtualListItem from './fileItem'
import virtualScrollList from 'vue-virtual-scroll-list'
import { getArtifactFileAPI, getStorageListAPI } from '@api'
import { sortBy } from 'lodash'
export default {
  name: 'pmArtifactDeploy',
  data () {
    return {
      itemComponent: virtualListItem,
      tarFileMap: {},
      objectstorageList: [],
      pickedTargetServices: [],
      pickedStorage: '',
      virtualData: {
        keeps: 20,
        size: 34,
        start: 0
      },
      startAll: {}
    }
  },
  methods: {
    getArtifactFile (services) {
      const allServiceNames = services.map(service => service.name)
      this.getArtifactFiles(allServiceNames)
    },
    getArtifactFiles (val) {
      return new Promise((resolve, reject) => {
        const objectstorage_id = this.pickedStorage
        const payload = { names: val }
        getArtifactFileAPI(payload, objectstorage_id).then((files) => {
          files = files || []
          this.tarFileMap = this.$utils.makeMapOfArray(files, 'name')
          resolve()
        })
      })
    },
    changeVirtualData (event, row, index) {
      const opt = event ? 0 : -1
      if (row.file) {
        const id = this.tarFileMap[row.name].map(item => item.file_name).indexOf(row.file.file_name) + opt
        if (this.startAll[row.name]) {
          this.startAll[row.name] = id
        } else {
          this.$set(this.startAll, row.name, id)
        }
        this.$refs[`scrollListRef${index}`].virtual.updateRange(id, id + this.virtualData.keeps)
      }
    },
    changeStorage (val) {
      if (val) {
        this.tarFileMap = []
        const allClickableServeiceNames = this.allServices.map(service => service.name)
        const payload = { names: allClickableServeiceNames }
        getArtifactFileAPI(payload, val).then((files) => {
          files = files || []
          this.tarFileMap = this.$utils.makeMapOfArray(files, 'name')
          this.pickedTargetServices.forEach(item => {
            item.file = null
            this.startAll[item.name] = 0
          })
        })
      }
    }
  },
  computed: {
    pmArtifactDeployData () {
      return {
        services: this.pickedTargetServices,
        pickedStorage: this.pickedStorage
      }
    }
  },
  created () {
    // 如果 PM 交付物部署开启则获取对应服务和对象仓库
    getStorageListAPI().then((res) => {
      this.objectstorageList = res
      // 克隆任务数据
      if (this.forcedUserInput.storage_id) {
        this.pickedStorage = this.forcedUserInput.storage_id
        this.pickedTargetServices = sortBy(this.forcedUserInput.artifact_args.map(element => {
          element.key = element.name + '/' + element.service_name
          element.file = {
            file_name: element.file_name,
            name: element.name,
            service_name: element.service_name,
            task_id: element.task_id,
            url: element.url,
            workflow_name: element.workflow_name
          }
          return element
        }), 'service_name')
        this.getArtifactFiles(this.forcedUserInput.artifact_args.map(r => r.name)).then(() => {
          this.forcedUserInput.artifact_args.forEach((art, index) => {
            this.changeVirtualData(false, art, index)
          })
        })
        return
      }
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].is_default) {
            this.pickedStorage = res[i].id
            break
          };
        }
      }
    })
  },
  props: {
    forcedUserInput: {
      type: Object,
      default () {
        return {}
      }
    },
    allServices: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    pmArtifactDeployData: {
      handler (new_val, old_val) {
        if (new_val) {
          this.$emit('update:pmArtifactDeployData', new_val)
        }
      },
      deep: true
    }
  },
  components: {
    virtualScrollList
  }
}
</script>
