<template>
  <el-dialog :title="`${editUser.name} 系统角色`" width="20%" custom-class="create-team-dialog" :visible.sync="dialogEditRoleVisible">
    <el-form  @submit.native.prevent  ref="nameForm">
      <el-form-item label="系统角色" prop="leaders">
        <el-select size="small" v-model="isSuperUser">
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
import { queryUserBindings, addSystemRoleBindings, deleteSystemRoleBindings } from '@/api'
export default {
  name: 'editUserRole',
  props: {
    editUser: Object
  },
  data () {
    return {
      dialogEditRoleVisible: false,
      isSuperUser: false,
      adminRole: null
    }
  },
  methods: {
    handleUserRoleUpdate () {
      if (this.adminRole) {
        if (this.isSuperUser) {
          this.dialogEditRoleVisible = false
        } else {
          this.deleteBindings(this.adminRole.name)
        }
      } else {
        if (this.isSuperUser) {
          this.addBindings()
        } else {
          this.dialogEditRoleVisible = false
        }
      }
    },
    async deleteBindings (name) {
      const res = await deleteSystemRoleBindings(name).catch(error => console.log(error))
      if (res) {
        this.$message.success('删除管理员权限成功')
        this.dialogEditRoleVisible = false
      }
    },
    async addBindings () {
      const paload = {
        name: this.editUser.uid + '-' + 'admin',
        role: 'admin',
        uid: this.editUser.uid
      }
      const res = await addSystemRoleBindings(paload).catch(error => console.log(error))
      if (res) {
        this.$message.success('创建管理员权限成功')
        this.dialogEditRoleVisible = false
      }
    },
    async getBindings () {
      this.isSuperUser = false
      this.adminRole = null
      const res = await queryUserBindings(this.editUser.uid).catch(error => console.log(error))
      if (res) {
        res.forEach(item => {
          if (item.role === 'admin') {
            this.isSuperUser = true
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
