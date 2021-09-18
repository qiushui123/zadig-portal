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
    <span class="valid">{{ validRes }}</span>
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
        this.validRes = 'key 值重复'
        callback(new Error('key 值重复'))
      } else {
        this.validRes = ''
        callback()
      }
    }

    const validateValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入 value 值'))
      } else {
        callback()
      }
    }

    this.rules = {
      key: [{ validator: validateKey, trigger: 'blur' }],
      value: [{ validator: validateValue, trigger: 'blur' }]
    }

    return {
      keyValueForm: {
        key: '',
        value: '',
        index: -1
      },
      validRes: ''
    }
  },
  props: {
    keyValues: {
      default: () => [],
      type: Array
    }
  },
  watch: {
    keyValues (newV, oldV) {
      if (newV !== oldV) {
        this.resetValid()
      }
    },
    keyValueForm: {
      handler (newV, oldV) {
        if (newV === oldV) {
          this.keyValues[newV.index] = {
            key: newV.key,
            value: newV.value
          }
        }
      },
      deep: true
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
        this.initForm()
      } else if (id > index) {
        this.keyValueForm.index = id - 1
      }
    },
    async addKeyValue () {
      const res = await this.validate(this.keyValueForm.index)
      const findIndex = this.keyValues.findIndex(value => value.key === '')
      if (findIndex !== -1) {
        this.keyValueForm.index = findIndex
        return
      }
      if (res) {
        this.keyValues.push({
          key: '',
          value: ''
        })
        this.keyValueForm.index = this.keyValues.length - 1
      }
    },
    validate (index = this.keyValueForm.index) {
      if (index === -1) {
        return Promise.resolve(true)
      }
      return this.$refs.form
        .validate()
        .then(() => {
          const { key, value } = this.keyValueForm
          this.keyValues[index] = {
            key,
            value
          }
          this.initForm()
          return Promise.resolve(true)
        })
        .catch(err => {
          console.log(err)
          return Promise.reject(false)
        })
    },
    initForm () {
      this.validRes = ''
      this.$refs.form && this.$refs.form.clearValidate()
      this.keyValueForm = {
        key: '',
        value: '',
        index: -1
      }
    },
    resetValid () {
      this.initForm()
      const len = this.keyValues.length
      if (len && this.keyValues[len - 1].key === '') {
        this.keyValues.splice(len - 1, 1)
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

  .valid {
    display: inline-block;
    padding-left: 5px;
    color: #f56c6c;
    font-size: 12px;
  }
}
</style>
