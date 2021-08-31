<template>
  <div class="values-outer">
    <div class="yaml-container">
      <h4>
        <span>{{ fileName }}</span>
        <i v-if="showDelete" class="el-icon-delete-solid icon-delete" @click="hiddenValueEdit"></i>
      </h4>
      <el-divider></el-divider>
      <div class="desc">
        <div>请输入 values.yaml 配置</div>
        <codemirror class="mirror" :resize="resize" :height="height" :value="yamlValue" @input="handleInput"></codemirror>
      </div>
    </div>

    <!-- 底部的添加键值对 -->
    <key-value v-if="showKeyValue"></key-value>
  </div>
</template>

<script>
import Codemirror from '../codemirror.vue'
import KeyValue from './key_value.vue'
export default {
  data () {
    return {
    }
  },
  props: {
    fileName: {
      default: 'values 文件',
      type: String
    },
    yaml: String,
    showKeyValue: {
      default: false,
      type: Boolean
    },
    showDelete: {
      default: false,
      type: Boolean
    },
    height: {
      default: '300px',
      type: String
    },
    resize: {
      default: 'none',
      type: String
    }
  },
  computed: {
    yamlValue: {
      get () {
        return this.yaml || ''
      },
      set (val) {
        return val
      }
    }
  },
  methods: {
    handleInput (code) {
      this.yamlValue = code
      this.$emit('update:yaml', code)
    },
    hiddenValueEdit () {
      this.$emit('closeValueEdit')
    }
  },
  components: {
    Codemirror,
    KeyValue
  }
}
</script>

<style lang="less" scoped>
.values-outer {
  /deep/ .el-divider--horizontal {
    margin: 12px 0;
  }

  .yaml-container {
    padding: 10px;
    line-height: 1;

    h4 {
      margin: 7px 0;
      color: #606266;
      font-size: 14px;

      .icon-delete {
        float: right;
        cursor: pointer;
      }
    }

    .desc {
      color: #a1a3a7;
      font-size: 14px;

      .mirror {
        margin-top: 12px;
      }
    }
  }
}
</style>
