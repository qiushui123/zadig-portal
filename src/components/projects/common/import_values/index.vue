<template>
  <div class="values-outer">
    <div class="yaml-container">
      <h4>
        <span>{{ fileName }}</span>
        <i v-if="showDelete" class="el-icon-delete-solid icon-delete" @click="hiddenValueEdit"></i>
      </h4>
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
import Codemirror from '../codemirror.vue'
import KeyValue from './key_value.vue'
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
    },
    showDelete: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleInput (code) {
      this.yamlValue = code
    },
    hiddenValueEdit () {
      this.$emit('closeValueEdit')
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
  /deep/ .el-divider--horizontal {
    margin: 14px 0;
  }

  .yaml-container {
    padding: 10px;

    h4 {
      margin: 7px 0;
      color: #4d4c4c;
      font-size: 14px;

      .icon-delete {
        float: right;
        cursor: pointer;
      }
    }

    .desc {
      color: #a1a3a7;
      font-size: 14px;
    }
  }
}
</style>
