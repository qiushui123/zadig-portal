<template>
  <div @keydown.meta.83.prevent="handleSave">
    <Resize :resize="resize" :height="height">
      <codemirror ref="cmEditor" :value="value" class="codemirror" :options="options" @input="handleInput"></codemirror>
    </Resize>
  </div>
</template>

<script>
import Resize from '@/components/common/resize'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/theme/neo.css'
import { debounce } from 'lodash'
const options = {
  tabSize: 2,
  mode: 'text/yaml',
  theme: 'neo',
  lineNumbers: true,
  line: true
}
export default {
  data () {
    return {}
  },
  props: {
    value: {
      default: '',
      type: String
    },
    resize: {
      default: 'vertical',
      type: String
    },
    height: {
      default: '300px',
      type: String
    }
  },
  methods: {
    handleInput: debounce(function (code) {
      this.$emit('input', code)
    }, 200),
    handleSave (event) {
      this.$emit('saveValue', { event, value: this.value })
    }
  },
  components: {
    codemirror,
    Resize
  },
  created () {
    this.options = options
  },
  mounted () {
    this.$refs.cmEditor.codemirror.focus()
  }
}
</script>

<style lang="less" scoped>
.codemirror {
  height: 100%;
  margin: -5px;

  /deep/.CodeMirror {
    height: 100%;
  }
}
</style>
