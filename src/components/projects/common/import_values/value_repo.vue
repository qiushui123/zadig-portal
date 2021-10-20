<template>
  <div class="value-repo-container">
    <el-form
      :model="source"
      :rules="sourceRules"
      ref="repoForm"
      :show-message="false"
      status-icon
      label-position="right"
      :label-width="hiddenLabel ? '0px' : '140px'"
      class="value-repo-form"
      :class="{'hidden-label': hiddenLabel}"
    >
      <el-form-item prop="codehostID" label="托管平台">
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
      <el-form-item prop="owner" label="代码库拥有者">
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
      <el-form-item prop="repo" label="代码库名称">
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
      <el-form-item prop="branch" label="分支">
        <el-select v-model.trim="source.branch" placeholder="请选择分支" style="width: 100%;" size="small" filterable allow-create clearable>
          <el-option v-for="(branch, branch_index) in codeInfo['branches']" :key="branch_index" :label="branch.name" :value="branch.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          <el-tooltip v-if="!substantial" effect="dark" content="按照覆盖顺序依次选择 values 文件，后选的文件会覆盖先选的文件。" placement="top">
            <span>文件路径</span>
          </el-tooltip>
          <span v-else>文件路径</span>
        </template>
        <div v-show="source.valuesPaths.length" class="overflow-auto">
          <div v-for="(path, index) in source.valuesPaths" :key="index">
            <span style="line-height: 18px;">{{path}}</span>
            <el-button v-if="!substantial" type="text" icon="el-icon-close" @click="deletePath(index)" style="padding: 1px 0 1px 0.5rem;"></el-button>
          </div>
        </div>
        <el-button :disabled="canSelectFile" type="primary" round plain size="mini" @click="showFileSelectDialog = true">选择 values 文件</el-button>
        <span v-show="showErrorTip" class="error-tip">请选择 values 文件</span>
      </el-form-item>
      <el-dialog title="请选择服务的 values 文件" :visible.sync="showFileSelectDialog" append-to-body>
        <Repertory :gitRepoConfig="source" @checkedPath="checkedPath" :checkOne="!substantial"></Repertory>
      </el-dialog>
    </el-form>
  </div>
</template>
<script>
import RepoMixin from '../mixin/import_repo'
import Repertory from './repertory.vue'
import { uniq } from 'lodash'

export default {
  props: {
    valueRepoInfo: Object,
    hiddenLabel: {
      default: false,
      type: Boolean
    },
    substantial: {
      default: false,
      type: Boolean
    }
  },
  mixins: [RepoMixin],
  data () {
    return {
      showFileSelectDialog: false,
      showErrorTip: false
    }
  },
  computed: {
    canSelectFile () {
      const source = this.source
      return !(
        source.codehostID &&
        source.owner &&
        source.repo &&
        source.branch
      )
    }
  },
  watch: {
    valueRepoInfo: {
      handler (nVal, oldV) {
        this.source = nVal
      },
      immediate: true
    }
  },
  methods: {
    checkedPath (data) {
      this.showFileSelectDialog = false
      this.source.valuesPaths = uniq(this.source.valuesPaths.concat(data))
      if (this.source.valuesPaths.length) {
        this.showErrorTip = false
      }
    },
    deletePath (index) {
      this.source.valuesPaths.splice(index, 1)
    },
    validateRoute () {
      if (this.source.valuesPaths.length) {
        this.showErrorTip = false
        return Promise.resolve()
      } else {
        this.showErrorTip = true
        return Promise.reject()
      }
    }
  },
  components: {
    Repertory
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
    &.value-repo-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }

    &.hidden-label {
      .el-form-item__label {
        display: none;
      }
    }

    &.el-form--label-right {
      .el-form-item__label {
        text-align: right;
      }
    }
  }

  .overflow-auto {
    max-height: 90px;
    margin: 9px 0;
    overflow: auto;
    line-height: 20px;

    &::-webkit-scrollbar-track {
      background-color: #f5f5f5;
      border-radius: 6px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }

    &::-webkit-scrollbar {
      width: 6px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #b7b8b9;
      border-radius: 6px;
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    }
  }

  .error-tip {
    margin-top: 10px;
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
  }
}

.submit-button {
  text-align: center;
}
</style>
