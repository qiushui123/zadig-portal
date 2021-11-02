<template>
  <div class="chart-aside">
    <div class="aside-bar">
      <div class="bar-title" :class="{selected:selected === 'var' }" @click="selected = 'var'">变量</div>
      <div class="bar-title" :class="{selected:selected === 'quote' }" @click="selected = 'quote'">反向引用</div>
    </div>
    <div class="aside-content">
      <ModuleUse v-if="selected === 'quote'"></ModuleUse>
      <VariableList v-if="selected === 'var'" :systemVariables="systemVariables" :customVariables="customVariables"></VariableList>
    </div>
  </div>
</template>

<script>
import ModuleUse from './aside/module_use.vue'
import VariableList from './aside/variable_list.vue'
export default {
  data () {
    return {
      selected: 'var'
    }
  },
  props: {
    systemVariables: {
      require: true,
      type: Array
    },
    customVariables: {
      require: true,
      type: Array
    }
  },
  components: {
    ModuleUse,
    VariableList
  }
}
</script>

<style lang="less" scoped>
.chart-aside {
  display: flex;
  flex-direction: row-reverse;

  .aside-bar {
    width: 47px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;

    .bar-title {
      margin: 0 0 1px 1px;
      padding: 20px 17px;
      transition: all 0.5s;

      &.selected,
      &:hover {
        background-color: #fff;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.05);
      }
    }
  }

  .aside-content {
    flex: 1;
    width: calc(~'100% - 47px');
  }
}
</style>
