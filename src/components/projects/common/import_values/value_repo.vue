<template>
  <div class="value-repo-container">
    <el-form :model="source" :rules="sourceRules" ref="repoForm">
      <el-form-item prop="codehostID">
        <el-select
          v-model="source.codehostID"
          size="small"
          style="width: 100%;"
          placeholder="请选择托管平台"
          @change="queryRepoOwnerById(source.codehostID)"
          filterable
        >
          <el-option
            v-for="(host, index) in allCodeHosts"
            :key="index"
            :label="`${host.address} ${
                  host.type === 'github' ? '(' + host.namespace + ')' : ''
                }`"
            :value="host.id"
          >
            {{
            `${host.address}
            ${host.type === 'github' ? '(' + host.namespace + ')' : ''}`
            }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="owner">
        <el-select
          v-model="source.owner"
          size="small"
          style="width: 100%;"
          @change="getRepoNameById(source.codehostID, source.owner)"
          placeholder="请选择代码库拥有者"
          filterable
        >
          <el-option v-for="(repo, index) in codeInfo['repoOwners']" :key="index" :label="repo.name" :value="repo.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="repo">
        <el-select
          @change="
                  getBranchInfoById(
                    source.codehostID,
                    source.owner,
                    source.repo
                  )
                "
          v-model.trim="source.repo"
          remote
          :remote-method="searchProject"
          style="width: 100%;"
          allow-create
          clearable
          size="small"
          placeholder="请选择代码库"
          filterable
        >
          <el-option v-for="(repo, index) in codeInfo['repos']" :key="index" :label="repo.name" :value="repo.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="branch">
        <el-select
          v-model.trim="source.branch"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          filterable
          allow-create
          clearable
        >
          <el-option v-for="(branch, branch_index) in codeInfo['branches']" :key="branch_index" :label="branch.name" :value="branch.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="file-route">
      <div class="title">文件路径</div>
      <div v-for="(path, index) in source.valuesPaths" :key="index">
        <el-input v-model="path.path" placeholder="values.yaml 文件路径" size="small"></el-input>
        <el-button type="text" @click="review(index)">预览</el-button>
        <el-button v-show="source.valuesPaths.length > 1" type="text" @click="deletePath(index)">移除</el-button>
      </div>
      <el-button icon="el-icon-plus" type="text" size="small" @click="addPath">添加 values 文件</el-button>
      <el-alert v-show="showTip" title="请先添加 value 文件" type="warning" :closable="false"></el-alert>
    </div>
  </div>
</template>
<script>
import RepoMixin from '../mixin/import_repo'
import { cloneDeep } from 'lodash'

export default {
  props: {
    valueRepoInfo: Object
  },
  mixins: [RepoMixin],
  data () {
    return {
      showTip: false
    }
  },
  watch: {
    source: {
      handler (newV) {
        this.$emit('update:valueRepoInfo', cloneDeep(newV))
      },
      deep: true
    }
  },
  methods: {
    review (index) {
      console.log('review values.yaml: ', this.source.valuesPaths[index].yaml)
    },
    deletePath (index) {
      if (this.source.valuesPaths.length < 2) return
      this.source.valuesPaths.splice(index, 1)
    },
    addPath () {
      if (!this.source.valuesPaths[this.source.valuesPaths.length - 1].path) {
        this.showTip = true
        return
      }
      this.showTip = false
      this.source.valuesPaths.push({
        path: '',
        yaml: ''
      })
    },
    validateRoute () {
      const path = this.source.valuesPaths.find(path => path.path === '')
      if (path) {
        this.showTip = true
        return Promise.reject()
      } else {
        this.showTip = false
        return Promise.resolve()
      }
    }
  },
  created () {
    this.source = cloneDeep(this.valueRepoInfo)
  }
}
</script>
<style lang="less" scoped>
.value-repo-container {
  .repo-attr {
    span {
      display: inline-block;
      width: 128px;
      margin-bottom: 20px;
      padding-right: 12px;
      line-height: 40px;
      text-align: right;
    }
  }

  /deep/.el-form {
    .el-form-item {
      margin-bottom: 12px;
    }
  }

  .file-route {
    .title {
      padding: 10px 0;
    }

    /deep/.el-input {
      width: calc(~'100% - 90px');
      margin-right: 10px;
    }
  }
}

.submit-button {
  text-align: center;
}
</style>
