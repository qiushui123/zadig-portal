<template>
  <el-dialog :title="`${editUser.account} 系统角色`" width="30%" custom-class="edit-role-dialog" :visible.sync="dialogEditRoleVisible">
    <el-form @submit.native.prevent ref="nameForm">
      <el-form-item label="系统角色" prop="leaders">
        <el-select size="small" v-model="isAdmin" style="width: 100%;">
          <el-option label="管理员" :value="true"></el-option>
          <el-option label="普通用户" :value="false"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" native-type="submit" size="small" @click="handleUserRoleUpdate()" class="start-create">确定</el-button>
      <el-button plain native-type="submit" size="small" @click="dialogEditRoleVisible = false">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  queryUserBindings,
  addSystemRoleBindingsAPI,
  deleteSystemRoleBindingsAPI
} from '@api'
export default {
  name: 'editUserRole',
  props: {
    editUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isAdmin: false,
      adminRole: null,
      dialogEditRoleVisible: false
    }
  },
  methods: {
    handleUserRoleUpdate () {
      if (this.adminRole) {
        if (this.isAdmin) {
          this.dialogEditRoleVisible = false
        } else {
          this.deleteBindings(this.adminRole.name)
        }
      } else {
        if (this.isAdmin) {
          this.addBindings()
        } else {
          this.dialogEditRoleVisible = false
        }
      }
    },
    async deleteBindings (name) {
      const res = await deleteSystemRoleBindingsAPI(name).catch(error =>
        console.log(error)
      )
      if (res) {
        this.$message.success('角色权限设置成功')
        this.$emit('refreshUserList')
        this.dialogEditRoleVisible = false
      }
    },
    async addBindings () {
      const paload = {
        name: this.editUser.account + '-' + this.editUser.identity_type,
        role: 'admin',
        uid: this.editUser.uid
      }
      const res = await addSystemRoleBindingsAPI(paload).catch(error =>
        console.log(error)
      )
      if (res) {
        this.$message.success('角色权限设置成功')
        this.$emit('refreshUserList')
        this.dialogEditRoleVisible = false
      }
    },
    async getBindings () {
      this.isAdmin = false
      this.adminRole = null
      const res = await queryUserBindings(this.editUser.uid).catch(error =>
        console.log(error)
      )
      if (res) {
        res.forEach(item => {
          if (item.role === 'admin') {
            this.isAdmin = true
            this.adminRole = item
          }
        })
      }
    }
  },
  watch: {
    dialogEditRoleVisible (value) {
      if (value) {
        this.getBindings()
      }
    }
  }
}
</script>
