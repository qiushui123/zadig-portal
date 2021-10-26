<template>
  <el-dialog :title="`${editUser.name|| null} 系统角色`" width="20%" custom-class="create-team-dialog" :visible.sync="dialogEditRoleVisible">
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
import { queryUserBindings } from '@/api'
export default {
  name: 'editUserRole',
  props: {
    editUser: Object
  },
  data () {
    return {
      dialogEditRoleVisible: false,
      isSuperUser: false
    }
  },
  methods: {
    handleUserRoleUpdate () {
      console.log('1')
    },
    async getBindings () {
      this.isSuperUser = false
      const res = await queryUserBindings(editUser.uid).catch(error => console.log(error))
      if (res) {
        res.forEach(item => {
          if (item.role === 'admin') {
            this.isSuperUser = true
          }
        })
      }
    }
  },
  watch: {
    editUser (value) {
      this.getBindings()
    }
  }
}
</script>
