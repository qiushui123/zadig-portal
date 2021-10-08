<template>
  <div class="key-value-outer">
    <h5>指定需要覆盖的键值对</h5>
    <el-form ref="form" :model="keyValueForm">
      <el-table :data="keyValues">
        <el-table-column header-align="center" align="left" prop="key" label="键">
          <template slot-scope="{ row, $index }">
            <el-form-item
              v-if="keyValueForm.keyValues[$index]"
              :prop="`keyValues[${$index}].key`"
              :rules="[{
                  required: true, message: '请输入 key 值', trigger: 'blur'
              }, {
                  validator: validateKey, trigger: 'blur'
              }]"
            >
              <el-input v-model="keyValueForm.keyValues[$index].key" placeholder="键" size="small"></el-input>
            </el-form-item>
            <span v-else>{{row.key}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" prop="value" label="值">
          <template slot-scope="{ row, $index }">
            <el-form-item
              v-if="keyValueForm.keyValues[$index]"
              :prop="`keyValues[${$index}].value`"
              :rules="{
                validator: validateValue, trigger: 'blur'
              }"
            >
              <el-input v-model="keyValueForm.keyValues[$index].value" placeholder="值" size="small"></el-input>
            </el-form-item>
            <span v-else>{{row.value}}</span>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="操作" width="100px">
          <template slot-scope="{ $index }">
            <el-button v-if="keyValueForm.keyValues[$index]" type="text" @click="keyValues[$index].edit = false">保存</el-button>
            <el-button v-else type="text" @click="editKeyValue($index)">编辑</el-button>
            <el-button type="text" @click="keyValues.splice($index, 1)">删除</el-button>
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
    this.validateKey = (rule, value, callback) => {
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

    this.validateValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入 value 值'))
      } else {
        callback()
      }
    }

    return {
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
    keyValues (nVal, oVal) {
      if (nVal !== oVal) {
        this.removeEdit(oVal)
      }
    }
  },
  computed: {
    keyValueForm () {
      return {
        keyValues: this.keyValues.map(val => {
          return val.edit ? val : null
        })
      }
    }
  },
  methods: {
    editKeyValue (index) {
      this.$set(this.keyValues[index], 'edit', true)
    },
    addKeyValue () {
      this.keyValues.push({
        key: '',
        value: '',
        edit: true
      })
    },
    validate () {
      return this.$refs.form
        .validate()
        .then(() => {
          return Promise.resolve(true)
        })
        .catch(err => {
          console.log(err)
          return Promise.reject(false)
        })
        .then(() => {
          this.removeEdit()
        })
    },
    removeEdit (kvs = this.keyValues) {
      kvs.forEach(kv => {
        delete kv.edit
      })
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
