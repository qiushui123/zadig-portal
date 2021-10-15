<template>
  <el-select @change="changeTar" filterable clearable size="small" placeholder="请选择交付物">
    <el-option v-for="item in tarList" :key="item.task_id" :label="item.file_name"></el-option>
  </el-select>
</template>
<script>
import { getTarsApi } from '@/api'
export default {
  name: 'storagePick',
  props: {
    value: Object,
    id: String,
    name: String
  },
  data () {
    return {
      tarList: []
    }
  },
  methods: {
    async getTars () {
      const params = {
        id: this.id,
        names: [this.name]
      }
      const res = await getTarsApi(params).catch(error => cosnole.log(error))
      if (res) {
        this.tarList = res
      }
    },
    changeTar (item) {
      let obj = {
        service_name: value.service_name,
        name: value.name
      }
      if (item) {
        obj = { ...obj, workflow_name: item.workflow_name, task_id: item.task_id, file_name: item.file_name, url: item.url }
      }
      this.$emit('change', obj)
    }
  },
  mounted () {
    this.getTars()
  }
}
</script>
