<template>
  <div v-show="visible" class="notify-banner">
    <div class="layout-container">
      <span> {{title +' : '}}{{content}}
      </span>
      <span class="close-btn">
        <i @click="close()" class="el-icon-circle-close"></i>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      visible: true
    }
  },
  methods: {
    close () {
      this.visible = false
      this.$emit('close')
    }
  },
  created () {}
}
</script>
<style lang="less" >
.notify-banner {
  height: 40px;
  color: #595959;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  background-color: #faf6e1;

  .layout-container {
    max-width: 1056px;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
    padding-right: 16px;
    padding-left: 16px;

    .close-btn {
      padding: 0 5px;
      color: #ff4949;
      font-size: 15px;
      cursor: pointer;
    }
  }
}
</style>
