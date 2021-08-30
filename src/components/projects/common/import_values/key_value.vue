<template>
  <div class="key-value-outer">
    <h5>指定需要覆盖的键值对</h5>
    <el-table :data="keyValues">
      <el-table-column header-align="center" align="center" prop="key" label="键">
        <template slot-scope="{ row }">
          <el-input v-model="row.key" placeholder="键" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="value" label="值">
        <template slot-scope="{ row }">
          <el-input v-model="row.value" placeholder="值" size="small"></el-input>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" label="操作" width="50px">
        <template slot-scope="{ $index }">
          <el-button type="text" @click="deleteKeyValue($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="text" @click="addKeyValue" icon="el-icon-plus">添加需要覆盖的键值对</el-button>
  </div>
</template>

<script>
export default {
  props: {
    keyValues: {
      default: () => [],
      type: Array
    }
  },
  methods: {
    deleteKeyValue (index) {
      this.keyValues.splice(index, 1)
    },
    addKeyValue () {
      this.keyValues.push({
        key: '',
        value: ''
      })
    }
  }
}
</script>

<style lang="less" scoped>
.key-value-outer {
  padding: 10px 0;

  h5 {
    margin: 14px 0;
    font-size: 14px;
  }

  /deep/ .el-table {
    th {
      padding: 6px 0;
      text-align: left;
    }
  }
}
</style>
