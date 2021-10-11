<template>
  <AceEditor :value="value"  @input="handleChange" :lang="lang" :theme="theme" :options="options" :width="width" :height="height"></AceEditor>
</template>
<script>
import AceEditor from 'vue2-ace-bind'
import 'brace/ext/searchbox'
const defaultOptions = {
  enableEmmet: true,
  showLineNumbers: true,
  showFoldWidgets: true,
  showGutter: false,
  displayIndentGuides: false,
  showPrintMargin: false
}
export default {
  name: 'aceEditor',
  components: {
    AceEditor
  },
  props: {
    value: String,
    width: {
      default: '100%'
    },
    height: {
      default: '100%'
    },
    lang: {
      default: 'sh'
    },
    theme: {
      default: 'xcode'
    },
    options: {
      default: () => defaultOptions
    }
  },
  methods: {
    handleChange (value) {
      this.$emit('input', value)
    }
  },
  beforeCreate () {
    require(`brace/theme/${this.theme}`)
    require(`brace/mode/${this.lang}`)
  }
}
</script>
