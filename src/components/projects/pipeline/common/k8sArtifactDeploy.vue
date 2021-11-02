<template>
    <div >
      <el-form-item label="服务">
        <el-select v-model="pickedTargetServices"
                   @change="getServiceImg"
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
      <el-form-item label="镜像仓库" >
        <el-select v-model="pickedRegistry"
                   filterable
                   clearable
                   @change="changeRegistry"
                   size="medium"
                   class="full-width">
          <el-option v-for="(reg,index) of allRegistry"
                     :key="index"
                     :label="`${reg.reg_addr}/${reg.namespace}`"
                     :value="reg.id">
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
        <el-table-column label="镜像">
          <template slot-scope="scope">
            <div class="workflow-build-rows">
              <el-row class="build-row">
                <template>
                  <el-col :span="12">
                    <el-select v-if="imageMap[scope.row.name] && imageMap[scope.row.name].length > 0"
                               v-model="scope.row.image"
                               @visible-change="changeVirtualData($event, scope.row, scope.$index)"
                               filterable
                               clearable
                               size="small"
                               style="width: 100%;"
                               placeholder="请选择镜像">
                      <virtual-scroll-list :ref="`scrollListRef${scope.$index}`"
                                           style="height: 272px; overflow-y: auto;"
                                           :size="virtualData.size"
                                           :keeps="virtualData.keeps"
                                           :start="startAll[scope.row.name]"
                                           :dataKey="(img)=>{ return img.name+'-'+img.tag}"
                                           :dataSources="imageMap[scope.row.name]"
                                           :dataComponent="itemComponent">
                      </virtual-scroll-list>
                    </el-select>
                    <el-tooltip v-else
                                content="请求镜像失败，请手动输入镜像"
                                placement="top"
                                popper-class="gray-popper">
                      <el-input v-model="scope.row.image"
                                class="short-input"
                                size="small"
                                placeholder="请填写镜像"></el-input>
                    </el-tooltip>
                  </el-col>
                </template>
              </el-row>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showCreateVersion"
          class="create-version">
        <div class="create-checkbox">
          <el-checkbox v-model="versionInfo.enabled">创建版本</el-checkbox>
        </div>
        <el-form v-if="versionInfo.enabled"
                  :model="versionInfo"
                  label-width="80px"
                  ref="versionForm"
                  :rules="versionRules">
          <el-form-item label="版本名称"
                        prop="version">
            <el-input class="full-width"
                      v-model="versionInfo.version"
                      size="small"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="版本描述"
                        prop="desc">
            <el-input class="full-width"
                      type="textarea"
                      autosize
                      placeholder="请输入版本描述"
                      v-model="versionInfo.desc">
            </el-input>
          </el-form-item>
          <el-form-item label="标签"
                        prop="labels">
            <el-input class="full-width"
                      type="textarea"
                      autosize
                      placeholder="请输入版本标签，多个标签用 ; 分割"
                      v-model="versionInfo.labelStr">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>
<script>
import virtualListItem from './imageItem'
import virtualScrollList from 'vue-virtual-scroll-list'
import { getRegistryWhenBuildAPI, imagesAPI } from '@api'
import { uniq, sortBy } from 'lodash'
export default {
  data () {
    return {
      itemComponent: virtualListItem,
      imageMap: [],
      allRegistry: [],
      pickedTargetServices: [],
      pickedRegistry: '',
      versionInfo: {
        version: '',
        enabled: false,
        desc: '',
        labels: [],
        labelStr: ''
      },
      versionRules: {
        version: [
          { required: true, message: '请填写版本名称', trigger: ['blur', 'change'] }
        ]
      },
      virtualData: {
        keeps: 20,
        size: 34,
        start: 0
      },
      startAll: {}
    }
  },
  methods: {
    changeVirtualData (event, row, index) {
      const opt = event ? 0 : -1
      const id = this.imageMap[row.name].map(img => img.full).indexOf(row.image) + opt
      if (this.startAll[row.name]) {
        this.startAll[row.name] = id
      } else {
        this.$set(this.startAll, row.name, id)
      }
      this.$refs[`scrollListRef${index}`].virtual.updateRange(id, id + this.virtualData.keeps)
    },
    changeRegistry (val) {
      if (val) {
        this.imageMap = []
        const allClickableServeiceNames = this.allServices.map(service => service.name) // .filter(service => service.has_build)
        imagesAPI(uniq(allClickableServeiceNames), val).then((images) => {
          images = images || []
          for (const image of images) {
            image.full = `${image.name}:${image.tag}`
          }
          this.imageMap = this.$utils.makeMapOfArray(images, 'name')
          this.pickedTargetServices.forEach(tar => {
            tar.image = ''
            this.startAll[tar.name] = 0
          })
        })
      }
    },
    getServiceImg (services) {
      const allServiceNames = services.map(service => service.name)
      this.getServiceImgs(allServiceNames)
    },
    getServiceImgs (val) {
      return new Promise((resolve, reject) => {
        const registryId = this.pickedRegistry
        imagesAPI(uniq(val), registryId).then((images) => {
          images = images || []
          for (const image of images) {
            image.full = `${image.name}:${image.tag}`
          }
          this.imageMap = this.$utils.makeMapOfArray(images, 'name')
          resolve()
        })
      })
    }
  },
  computed: {
    k8sArtifactDeployData () {
      return {
        versionInfo: this.versionInfo,
        services: this.pickedTargetServices,
        pickedRegistry: this.pickedRegistry
      }
    },
    projectName () {
      return this.$route.params.project_name
    }
  },
  created () {
    // 如果 K8s 交付物部署开启则获取对应服务和镜像仓库
    getRegistryWhenBuildAPI(this.projectName).then((res) => {
      this.allRegistry = res
      // 克隆任务数据
      if (this.forcedUserInput.version_args && this.forcedUserInput.version_args.version) {
        Object.assign(this.versionInfo, this.forcedUserInput.version_args)
        this.versionInfo.labelStr = this.versionInfo.labels.join(';')
      }
      if (this.forcedUserInput.registry_id) {
        this.pickedRegistry = this.forcedUserInput.registry_id
        this.pickedTargetServices = sortBy(this.forcedUserInput.artifact_args.map(element => {
          element.key = element.name + '/' + element.service_name
          return element
        }), 'service_name')
        this.getServiceImgs(this.forcedUserInput.artifact_args.map(r => r.name)).then(() => {
          this.forcedUserInput.artifact_args.forEach((art, index) => {
            this.changeVirtualData(false, art, index)
          })
        })
        return
      }
      if (res && res.length > 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].is_default) {
            this.pickedRegistry = res[i].id
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
    },
    showCreateVersion: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  watch: {
    k8sArtifactDeployData: {
      handler (new_val, old_val) {
        if (new_val) {
          this.$emit('update:k8sArtifactDeployData', new_val)
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
