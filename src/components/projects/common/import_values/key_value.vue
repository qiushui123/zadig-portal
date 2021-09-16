<template>
  <div class="key-value-outer">
    <h5>指定需要覆盖的键值对</h5>
    <el-form ref="form" :model="keyValueForm" :rules="rules">
      <el-table :data="keyValues">
        <el-table-column header-align="center" align="left" prop="key" label="键">
          <template slot-scope="{ row, $index }">
            <el-form-item v-if="keyValueForm.index === $index" prop="key">
              <el-input v-model="keyValueForm.key" placeholder="键" size="small"></el-input>
            </el-form-item>
            <span v-else>{{row.key}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" prop="value" label="值">
          <template slot-scope="{ row, $index }">
            <el-form-item v-if="keyValueForm.index === $index" prop="value">
              <el-input v-model="keyValueForm.value" placeholder="值" size="small"></el-input>
            </el-form-item>
            <span v-else>{{row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="操作" width="100px">
          <template slot-scope="{ $index }">
            <el-form-item>
              <el-button v-if="keyValueForm.index === $index" type="text" @click="saveKeyValue($index)">保存</el-button>
              <el-button v-else type="text" @click="editKeyValue($index)">编辑</el-button>
              <el-button type="text" @click="deleteKeyValue($index)">删除</el-button>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <el-button type="text" @click="addKeyValue" icon="el-icon-plus">添加需要覆盖的键值对</el-button>
  </div>
</template>

<script>
export default {
  data () {
    const validateKey = (rule, value, callback) => {
      const keys = this.keyValues.map(value => value.key)
      if (value === '') {
        callback(new Error('请输入 key 值'))
      } else if (keys.indexOf(value) !== keys.lastIndexOf(value)) {
        callback(new Error('key 值重复'))
      } else {
        callback()
      }
    }

    this.rules = {
      key: [{ validator: validateKey, trigger: 'blur' }],
      value: [{ required: true, message: '请输入 key 值', trigger: 'blur' }]
    }

    return {
      keyValueForm: {
        key: '',
        value: '',
        index: -1
      }
    }
  },
  props: {
    keyValues: {
      default: () => [],
      type: Array
    }
  },
  methods: {
    saveKeyValue (index) {
      this.validate(index)
    },
    async editKeyValue (index) {
      const res = await this.validate(this.keyValueForm.index)
      if (res) {
        this.keyValueForm = { ...this.keyValues[index], index }
      }
    },
    deleteKeyValue (index) {
      this.keyValues.splice(index, 1)
      const id = this.keyValueForm.index
      if (id === index) {
        this.resetValid()
      } else if (id > index) {
        this.keyValueForm.index = id - 1
      }
    },
    async addKeyValue () {
      const res = await this.validate(this.keyValueForm.index)
      if (res) {
        this.keyValues.push({
          key: '',
          value: ''
        })
        this.keyValueForm.index = this.keyValues.length - 1
      }
    },
    validate (index = -1) {
      if (index === -1) {
        return true
      }
      return this.$refs.form
        .validate()
        .then(() => {
          const { key, value } = this.keyValueForm
          this.keyValues[index] = {
            key,
            value
          }
          this.resetValid()
          return true
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    resetValid () {
      this.$refs.form.clearValidate()
      this.keyValueForm = {
        key: '',
        value: '',
        index: -1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.key-value-outer {
  h5 {
    margin: 2px 0 14px;
    color: #606266;
    font-size: 14px;
  }

  /deep/ .el-table {
    th {
      padding: 3px 0;
      font-weight: 500;
      text-align: left;
    }

    td {
      padding: 3px 0;
    }

    .el-table__empty-block {
      min-height: 48px;

      .el-table__empty-text {
        line-height: 48px;
      }
    }

    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
