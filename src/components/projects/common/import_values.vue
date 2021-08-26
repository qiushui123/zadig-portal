<template>
  <div class="values-outer">
    <div class="yaml-container">
      <h4>{{ fileName }}</h4>
      <el-divider></el-divider>
      <div class="desc">
        <p>请输入 values.yaml 配置</p>
        <codemirror :value="yamlValue" @codemirrorInput="handleInput"></codemirror>
      </div>
    </div>

    <!-- 底部的添加键值对 -->
    <key-value v-if="showKeyValue"></key-value>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import Codemirror from './codemirror.vue'
import KeyValue from './import_values/key_value.vue'
export default {
  data () {
    return {
      valuesYaml: {
        origin: 'repo'
      },
      yamlValue: ''
    }
  },
  props: {
    fileName: {
      default: 'values 文件',
      type: String
    },
    yaml: Object,
    showKeyValue: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleInput (code) {
      this.yamlValue = code
    }
  },
  components: {
    Codemirror,
    KeyValue
  },
  created () {
    if (this.yaml) this.valuesYaml = cloneDeep(this.yaml)
  }
}
</script>

<style lang="less" scoped>
.values-outer {
  padding: 5px;

  /deep/ .el-divider--horizontal {
    margin: 14px 0;
  }

  .yaml-container {
    padding: 10px;
    background: #eee;

    h4 {
      margin: 10px 0;
    }

    .desc {
      padding: 0 10px;
      color: #a1a3a7;
      font-size: 14px;
    }
  }
}
</style>
