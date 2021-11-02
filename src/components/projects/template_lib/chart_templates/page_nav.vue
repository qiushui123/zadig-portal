<template>
  <div class="page-nav-container">
    <div
      class="tab"
      :class="{'is-current': file.fullPath === currentTab}"
      v-for="(file, index) in displayedFile"
      :key="file.fullPath"
      @click="clickTab(file, index)"
    >
      <span class="desc">{{ file.name }}</span>
      <i class="icon el-icon-close" @click.stop="closeFile(file, index)"></i>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },

  props: {
    displayedFile: {
      type: Array,
      require: true,
      default: () => {
        return []
      }
    },
    currentTab: {
      type: String,
      default: '',
      require: true
    }
  },
  methods: {
    clickTab (data, index) {
      this.$emit('updateFile', { data, index })
    },
    closeFile (data, index) {
      this.displayedFile.splice(index, 1)
      if (data.fullPath !== this.currentTab) return

      data = null
      index = -1
      if (this.displayedFile.length) {
        data = this.displayedFile[0]
        index = 0
      }
      this.clickTab(data, index)
    }
  }
}
</script>

<style lang="less" scoped>
.page-nav-container {
  display: flex;
  align-items: center;
  width: 100%;
  overflow-x: scroll;
  font-size: 13px;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  .tab {
    display: flex;
    flex: 0 0 110px;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;

    &.is-current {
      background: white;
    }

    .desc {
      display: inline-block;
      width: 90px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
      user-select: none;
    }

    .icon {
      cursor: pointer;
    }
  }
}
</style>
