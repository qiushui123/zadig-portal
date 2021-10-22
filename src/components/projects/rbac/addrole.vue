<template>
  <el-dialog class="form" title="添加角色" :visible.sync="dialogRoleAddFormVisible">
    <el-form ref="form" :model="form" :rules="formRules" >
      <el-form-item label="角色名称" prop="name" label-width="100px">
        <el-input size="small"  placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="权限列表" prop="rules" label-width="100px">
        <div class="permissions-group" v-for="(group,group_index) in permissionGroups" :key="group_index">
          <el-checkbox
            :label="group.resource"
            :key="group.resource"
            :value="calculatePermissionGroupsCheckedState(group.rules)"
            @change="handlePermissionGroupChange(group.rules)"
            :indeterminate="isIndeterminate(group.rules)"
          >{{group.alias}}</el-checkbox>
          <div class="sub-permissions">
            <el-checkbox-group v-model="form.rules">
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
      <el-button size="small" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { queryPolicyDefinitions } from '@/api'
import _ from 'lodash'

export default {
  name: 'addrole',
  data () {
    return {
      dialogRoleAddFormVisible: false,
      permissionGroups: [],
      form: {
        name: null,
        rules: ['get_workflow']
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        rules: [
          { type: 'array', required: true, message: '请选择至少一个权限', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handlePermissionGroupChange (groupName) {
      const groupDetail = this.permissionGroups.find((item) => item.name === groupName)
      const subPermissionUUIDs = groupDetail !== null
        ? groupDetail.subPermissions.map((item) => {
          return item.uuid
        })
        : null
      const isSelecting = !!(groupDetail !== null && !this.calculatePermissionGroupsCheckedState(groupName))

      if (subPermissionUUIDs) {
        if (isSelecting) {
          this.form.permissionUUIDs = _.uniq(this.form.permissionUUIDs.concat(subPermissionUUIDs))
        } else {
          this.form.permissionUUIDs = this.form.permissionUUIDs.filter((item) => {
            return !subPermissionUUIDs.includes(item)
          })
        }
      }
    },
    calculatePermissionGroupsCheckedState (rules) {
      const res1 = rules.map(item => (item.action))
      const res2 = this.form.rules
      if (res2.length) {
        const permissionDiff = _.difference(res1, res2)
        if (permissionDiff.length === 0) {
          return true
        }
      }
      return false
    },
    isIndeterminate (rules) {
      const res1 = rules.map(item => (item.action))
      const res2 = this.form.rules
      if (res2.length) {
        const permissionDiff = _.difference(res1, res2)
        if (permissionDiff.length > 0 && permissionDiff.length < res1.length) {
          return true
        }
      }
      return false
    },
    async getPolicyDefinitions () {
      const res = await queryPolicyDefinitions().catch(error => console.log(error))
      if (res) {
        this.permissionGroups = res
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
