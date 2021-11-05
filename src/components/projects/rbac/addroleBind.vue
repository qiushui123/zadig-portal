<template>
  <el-dialog class="form" title="添加成员" width="550px" :visible.sync="addUserFormVisible">
    <el-form :model="form" ref="form" :rules="formRules" label-width="100px">
      <el-form-item label="用户名称" prop="uids">
        <el-select
          class="select"
          v-model="form.uids"
          filterable
          remote
          multiple
          :remote-method="remoteMethod"
          :loading="getUsersLoading"
          size="small"
          placeholder="请输入用户名称进行搜索"
        >
          <el-option v-for="user in users" :key="user.uid" :label="user.name ? `${user.name}(${user.account})` : user.account" :value="user.uid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-select class="select" v-model="form.name" filterable size="small" placeholder="请输入角色名称进行搜索">
          <el-option v-for="item in rolesFiltered" :key="item.name" :label="item.name" :value="item.name">
            {{item.name}}  {{item.isPublic ? '(公共角色)': ''}}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="addUserFormVisible = false">取 消</el-button>
      <el-button size="small" @click="submit()" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { usersAPI, addRoleBindings } from '@/api'

export default {
  name: 'addroleBind',
  props: {
    projectName: String,
    rolesFiltered: Array,
    getMembers: Function
  },
  data () {
    return {
      addUserFormVisible: false,
      users: [],
      getUsersLoading: false,

      form: {
        uids: '',
        name: undefined
      },
      formRules: {
        uids: [
          { type: 'array', required: true, message: '请选择用户', trigger: 'change' }
        ],
        name: [
          { type: 'string', required: true, message: '请选择角色', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.addMember()
        }
      })
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        const payload = {
          name: query
        }
        usersAPI(payload).then((res) => {
          this.loading = false
          this.users = (_.uniqBy(res.users, 'uid'))
        })
      } else {
        this.users = []
      }
    },
    async addMember () {
      const { uids, name } = this.form
      const role = this.rolesFiltered.find(item => item.name === name)
      const payload = []
      uids.forEach(uid => {
        payload.push({
          name: uid + '-' + name,
          uid: uid,
          role: name,
          public: role.isPublic ? role.isPublic : false
        })
      })
      const res = await addRoleBindings(payload, this.projectName).catch(error => cosnole.log(error))
      if (res) {
        this.$message({
          message: '添加成员成功',
          type: 'success'
        })

        await this.getMembers()

        this.addUserFormVisible = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .form {
    .el-form-item {
      &:last-child {
        margin-bottom: 0;
      }

      .select {
        width: 100%;
      }
    }
  }
</style>
