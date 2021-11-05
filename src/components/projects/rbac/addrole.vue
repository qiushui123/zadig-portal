<template>
  <el-dialog class="form" title="添加角色" :visible.sync="dialogRoleAddFormVisible">
    <el-form ref="form" :model="form" :rules="formRules" >
      <el-form-item label="角色名称" prop="name" label-width="100px">
        <el-input size="small" :disabled="isEdit" v-model="form.name"  placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="角色类型" label-width="100px"
                      prop="isPublic">
          <el-radio-group v-model="form.isPublic">
            <el-radio :label="true">公共角色</el-radio>
            <el-radio :label="false">私有角色</el-radio>
          </el-radio-group>
       </el-form-item> -->
      <el-form-item label="权限列表" prop="permissions" label-width="100px">
        <div class="permissions-group" v-for="(group,group_index) in permissionGroups" :key="group_index">
          <el-checkbox
            :label="group.resource"
            :key="group.resource"
            :value="calculatePermissionGroupsCheckedState(group.rules)"
             @change="handlePermissionGroupChange(group.rules)"
            :indeterminate="isIndeterminate(group.resource,group.rules)"
          >{{group.alias}}</el-checkbox>
          <div class="sub-permissions">
            <el-checkbox-group v-model="form.permissions">
              <div>
                <el-checkbox
                  class="sub-permissions-checkbox"
                  v-for="(subPermission,sub_index) in   group.rules"
                  :key="sub_index"
                  :label="subPermission.action"
                >{{subPermission.alias}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogRoleAddFormVisible = false">取 消</el-button>
      <el-button size="small" type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryPolicyDefinitions, addrole, queryroleDetail, queryPublicRoleDetail, updaterole, updatePublicRole, addPublicRole } from '@/api'
import * as permissionMap from '@/consts/permissionMap'
import _ from 'lodash'

const initFormData = {
  name: '',
  permissions: [],
  isPublic: false

}

const resources = {
  Workflow: false,
  Environment: false,
  Service: false,
  Test: false,
  Delivery: false
}

export default {
  name: 'addrole',
  props: {
    projectName: String,
    currentRole: Object,
    getrole: Function
  },
  data () {
    return {
      isEdit: false,
      dialogRoleAddFormVisible: false,
      permissionGroups: [],
      form: {
        name: '',
        permissions: [],
        isPublic: false
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        isPublic: [
          { required: true, message: '请选择项目类型', trigger: 'blur' }
        ],
        permissions: [
          { type: 'array', required: true, message: '请选择至少一个权限', trigger: 'change' }

        ]
      }
    }
  },
  methods: {
    initNewForm () {
      this.form = _.cloneDeep(initFormData)
    },
    async getroleDetail (role) {
      let res = null
      if (role.isPublic) {
        res = await queryPublicRoleDetail(role.name, this.projectName).catch(error => console.log(error))
      } else {
        res = await queryroleDetail(role.name, this.projectName).catch(error => console.log(error))
      }
      res.rules.forEach(item => {
        if (item.kind === 'resource') {
          this.form.permissions = this.form.permissions.concat(item.verbs)
        }
      })
    },
    handlePermissionGroupChange (rules) {
      for (let i = 0; i < rules.length; i++) {
        if (this.form.permissions.includes(rules[i].action)) {
          const index = this.form.permissions.indexOf(rules[i].action)
          this.form.permissions.splice(index, 1)
        } else {
          const res = rules.map(item => (item.action))
          this.form.permissions = _.uniq(this.form.permissions.concat(res))
          return
        }
      }
    },
    calculatePermissionGroupsCheckedState (rules) {
      for (const rule of rules) {
        if (!this.form.permissions.includes(rule.action)) {
          return false
        }
      }
      return true
    },
    isIndeterminate (resource, rules) {
      for (const rule of rules) {
        if (this.form.permissions.includes(rule.action)) {
          resources[resource] = true
          return true
        }
      }
      resources[resource] = false

      return false
    },
    async getPolicyDefinitions () {
      const res = await queryPolicyDefinitions().catch(error => console.log(error))
      if (res) {
        this.permissionGroups = res
      }
    },
    async submit () {
      const res = await this.$refs.form.validate()
      const resource = []

      Object.keys(resources).forEach(i => {
        if (resources[i]) {
          resource.push(i)
        }
      })

      let rules = []
      const frontResources = []
      if (res) {
        this.form.permissions.forEach(key => {
          frontResources.push(permissionMap[key])
        })
        rules = [{ verbs: this.form.permissions, resources: resource, kind: 'resource' }, { verbs: ['VIEW'], resources: frontResources, kind: '' }]
        if (this.isEdit) {
          let result = null
          if (this.form.isPublic) {
            result = await updatePublicRole({ name: this.form.name, rules: rules }).catch(error => console.log(error))
          } else {
            result = await updaterole({ name: this.form.name, rules: rules, projectName: this.projectName }).catch(error => console.log(error))
          }
          if (result) {
            this.$message.success('修改成功')
            this.dialogRoleAddFormVisible = false
            this.getrole()
          }
        } else {
          let result = null
          if (this.form.isPublic) {
            result = await addPublicRole({ name: this.form.name, rules: rules }).catch(error => console.log(error))
          } else {
            result = await addrole({ name: this.form.name, rules: rules, projectName: this.projectName }).catch(error => console.log(error))
          }
          if (result) {
            this.$message.success('添加成功')
            this.dialogRoleAddFormVisible = false
            this.getrole()
          }
        }
      }
    }
  },
  watch: {
    dialogRoleAddFormVisible (value) {
      if (value && this.currentRole) {
        this.isEdit = true
        this.getroleDetail(this.currentRole)
        this.form.name = this.currentRole.name
        this.form.isPublic = !!this.currentRole.isPublic
      } else {
        this.isEdit = false

        this.initNewForm()
      }
    }
  },
  mounted () {
    this.getPolicyDefinitions()
  }
}
</script>
<style lang="less" scoped>
.permissions-group {
  .sub-permissions {
    margin-left: 25px;
  }
}
</style>
