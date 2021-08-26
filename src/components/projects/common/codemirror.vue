<template>
  <div @keydown.meta.83.prevent="handleSave">
    <codemirror :value="value" class="codemirror" :options="options" @input="handleInput"></codemirror>
  </div>
</template>

<script>
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
    }
  },
  methods: {
    handleInput: debounce(function (code) {
      this.$emit('codemirrorInput', code)
    }, 200),
    handleSave (event) {
      this.$emit('saveValue', { event, value: this.value })
    }
  },
  components: {
    codemirror
  },
  created () {
    this.options = options
  }
}
</script>

<style lang="less" scoped>
.codemirror {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>
