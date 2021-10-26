<template>
  <div class="key-value-outer">
    <h5>指定需要覆盖的键值对</h5>
    <el-form ref="form" :model="keyValueForm">
      <el-table :data="keyValues">
        <el-table-column header-align="center" align="left" label="键">
          <template slot-scope="{ $index }">
            <el-form-item
              :prop="`keyValues[${$index}].key`"
              :rules="[{
                  required: true, message: '请输入 key 值', trigger: 'blur'
              }, {
                  validator: validateKey, trigger: 'change'
              }]"
            >
              <el-select
                v-model="keyValueForm.keyValues[$index].key"
                filterable
                allow-create
                clearable
                placeholder="键"
                size="small"
                @change="selectKey($event, $index)"
                @visible-change="firstEstimatedValues"
              >
                <el-option v-for="key in lastKeys" :key="key" :label="key" :value="key"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="值">
          <template slot-scope="{ $index }">
            <el-form-item
              :prop="`keyValues[${$index}].value`"
              :rules="{
                  required: true, message: '请输入 value 值', trigger: 'blur'
              }"
            >
              <el-input v-model="keyValueForm.keyValues[$index].value" placeholder="值" size="small"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column header-align="center" align="left" label="操作" width="100px">
          <template slot-scope="{ $index }">
            <el-button type="text" @click="keyValues.splice($index, 1)">删除</el-button>
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
    this.validateKey = (rule, value, callback) => {
      const keys = this.keyValues.map(value => value.key)
      if (value === '') {
        callback(new Error('请输入 key 值'))
      } else if (keys.indexOf(value) !== keys.lastIndexOf(value)) {
        callback(new Error('key 值重复'))
      } else {
        callback()
      }
    }

    return {}
  },
  props: {
    keyValues: {
      default: () => [],
      type: Array
    },
    listKeyValues: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    keyValueForm () {
      return {
        keyValues: this.keyValues
      }
    },
    lastKeys () {
      const keys = this.keyValues.map(kv => kv.key)
      return Object.keys(this.listKeyValues).filter(key => !keys.includes(key))
    }
  },
  methods: {
    selectKey (key, index) {
      this.keyValues[index].value = this.listKeyValues[key] || ''
    },
    firstEstimatedValues (value) {
      if (value && this.lastKeys.length === 0) this.$emit('estimatedValues')
    },
    addKeyValue () {
      this.validate().then(() => {
        this.keyValues.push({
          key: '',
          value: ''
        })
        this.$emit('estimatedValues')
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
