<template>
  <div class="project-home">

  </div>
</template>
<script>
export default {
  methods: {},
  computed: {
    projectName () {
      return this.$route.params.project_name
    }
  },
  mounted () {
    this.$router.replace(`/v1/projects/detail/${this.projectName}/rbac/member`)
  }
}
</script>

<style lang="less" >
.project-home {
  position: relative;
  flex: 1;
  padding: 10px 20px;
  overflow: auto;
  font-size: 15px;
}
</style>
