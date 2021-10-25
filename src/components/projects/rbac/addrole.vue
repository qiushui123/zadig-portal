<template>
  <el-dialog class="form" title="添加角色" :visible.sync="dialogRoleAddFormVisible">
    <el-form ref="form" :model="form" :rules="formRules" >
      <el-form-item label="角色名称" prop="name" label-width="100px">
        <el-input size="small" v-model="form.name"  placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="权限列表" prop="permissions" label-width="100px">
        <div class="permissions-group" v-for="(group,group_index) in permissionGroups" :key="group_index">
          <el-checkbox
            :label="group.resource"
            :key="group.resource"
            :value="calculatePermissionGroupsCheckedState(group.resource)"
             @change="handlePermissionGroupChange(group.resource)"
            :indeterminate="isIndeterminate(group.resource)"
          >{{group.alias}}</el-checkbox>
          <div class="sub-permissions">
            <el-checkbox-group v-model="form.permissions[group.resource]">
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
import { queryPolicyDefinitions, addrole } from '@/api'
import * as permissionMap from '@/consts/permissionMap'

export default {
  name: 'addrole',
  props: {
    projectName: String,
    getrole: Function
  },
  data () {
    const permissionsValidator = (rule, value, callback) => {
      const permissions = this.form.permissions
      if (!permissions.Workflow.length && !permissions.Environment.length && !permissions.Service.length && !permissions.Test.length && !permissions.Delivery.length) {
        callback(new Error('请选择至少一个权限'))
      }
      callback()
    }
    return {
      dialogRoleAddFormVisible: false,
      permissionGroups: [],
      form: {
        name: '',
        permissions: {
          Workflow: [],
          Environment: [],
          Service: [],
          Test: [],
          Delivery: []
        }
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        permissions: [
          { validator: permissionsValidator, trigger: 'change' }

        ]
      }
    }
  },
  methods: {
    handlePermissionGroupChange (resource) {
      const permissonItem = this.permissionGroups.find(item => item.resource === resource)
      if (this.form.permissions[resource].length === permissonItem.rules.length) {
        this.form.permissions[resource] = []
      } else {
        this.form.permissions[resource] = permissonItem.rules.map(item => (item.action))
      }
    },
    calculatePermissionGroupsCheckedState (resource) {
      const permissonItem = this.permissionGroups.find(item => item.resource === resource)
      if (this.form.permissions[resource].length === permissonItem.rules.length) {
        return true
      }
      return false
    },
    isIndeterminate (resource) {
      if (this.form.permissions[resource].length) {
        return true
      } else {
        return false
      }
    },
    async getPolicyDefinitions () {
      const res = await queryPolicyDefinitions().catch(error => console.log(error))
      if (res) {
        this.permissionGroups = res
      }
    },
    async submit () {
      const res = await this.$refs.form.validate()
      let verbs = []
      const resources = []
      let rules = []
      const frontResources = []
      if (res) {
        Object.keys(this.form.permissions).forEach(key => {
          if (this.form.permissions[key].length) {
            resources.push(key)
            verbs = verbs.concat(this.form.permissions[key])
            this.form.permissions[key].forEach(item => {
              frontResources.push(permissionMap[item])
            })
          }
        })
        rules = [{ verbs: verbs, resources: resources, kind: 'resource' }, { verbs: ['VIEW'], resources: frontResources, kind: '' }]
        const result = await addrole({ name: this.form.name, rules: rules, projectName: this.projectName }).catch(error => console.log(error))
        if (result) {
          this.$message.success('添加成功')
          this.dialogRoleAddFormVisible = false
          this.getrole()
        }
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
