<template>
  <div class="module-use">
    <header>模板引用</header>
    <section>
      <div class="desc">当前模板版本：{{ info.version }}</div>
      <el-table :data="info.used" style="width: 100%;">
        <el-table-column prop="project_name" label="项目"></el-table-column>
        <el-table-column prop="service_name" label="服务"></el-table-column>
        <el-table-column prop="version" label="模板版本"></el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      require: false, // true
      type: Object,
      default: () => {
        return {
          version: '',
          used: []
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.module-use {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 20px 20px;
  background-color: #fff;

  header {
    padding: 20px 0;
    font-weight: 700;
    font-size: 16px;
    line-height: 1;
  }

  section {
    .desc {
      font-size: 14px;
      line-height: 2;
    }
  }
}
</style>
