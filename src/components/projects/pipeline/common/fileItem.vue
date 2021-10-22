<template>
  <el-option :key="`${source.file_name}`"
             :label="source.file_name"
             :value="source">
  </el-option>
</template>

<script>
export default {
  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
