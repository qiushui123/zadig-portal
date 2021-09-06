<template>
  <div class="value-repo-container">
    <el-form :model="source" :rules="sourceRules" ref="repoForm">
      <el-form-item prop="codehostId">
        <el-select
          v-model="source.codehostId"
          size="small"
          style="width: 100%;"
          placeholder="请选择托管平台"
          @change="queryRepoOwnerById(source.codehostId)"
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
      <el-form-item prop="repoOwner">
        <el-select
          v-model="source.repoOwner"
          size="small"
          style="width: 100%;"
          @change="getRepoNameById(source.codehostId, source.repoOwner)"
          placeholder="请选择代码库拥有者"
          filterable
        >
          <el-option v-for="(repo, index) in codeInfo['repoOwners']" :key="index" :label="repo.name" :value="repo.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="repoName">
        <el-select
          @change="
                  getBranchInfoById(
                    source.codehostId,
                    source.repoOwner,
                    source.repoName
                  )
                "
          v-model.trim="source.repoName"
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
      <el-form-item prop="branchName">
        <el-select
          v-model.trim="source.branchName"
          placeholder="请选择"
          style="width: 100%;"
          size="small"
          filterable
          allow-create
          clearable
          @change="selectedRepoChange"
        >
          <el-option v-for="(branch, branch_index) in codeInfo['branches']" :key="branch_index" :label="branch.name" :value="branch.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="file-route">
      <div class="title">文件路径</div>
      <div v-for="(path, index) in valuesPaths" :key="index">
        <el-input v-model="path.path" placeholder="values.yaml 文件路径" size="small"></el-input>
        <el-button type="text" @click="review(index)">预览</el-button>
        <el-button v-show="valuesPaths.length > 1" type="text" @click="deletePath(index)">移除</el-button>
      </div>
      <el-button icon="el-icon-plus" type="text" size="small" @click="addPath">添加 values 文件</el-button>
      <el-alert v-show="showTip" title="请先添加 value 文件" type="warning" :closable="false"></el-alert>
    </div>
  </div>
</template>
<script>
import RepoMixin from '../mixin/import_repo'

export default {
  props: {
    currentService: Object,
    valuesPaths: Array
  },
  mixins: [RepoMixin],
  data () {
    return {
      showTip: false
    }
  },
  methods: {
    review (index) {
      console.log('review values.yaml: ', this.valuesPaths[index].yaml)
    },
    deletePath (index) {
      if (this.valuesPaths.length < 2) return
      this.valuesPaths.splice(index, 1)
    },
    addPath () {
      if (!this.valuesPaths[this.valuesPaths.length - 1].path) {
        this.showTip = true
        return
      }
      this.showTip = false
      this.valuesPaths.push({
        path: '',
        yaml: ''
      })
    },
    validateRoute () {
      const path = this.valuesPaths.find(path => path.path === '')
      if (path) {
        this.showTip = true
        return Promise.reject()
      } else {
        this.showTip = false
        return Promise.resolve()
      }
    }
  },
  watch: {
    value: {
      handler (value) {
        const currentService = this.currentService
        if (value && currentService) {
          this.source.codehostId = currentService.codehostID
          this.source.branchName = currentService.branch
          this.source.repoName = currentService.repo
          this.source.repoOwner = currentService.owner
        }
      },
      immediate: true
    }
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
