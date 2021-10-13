<template>
  <div class="workflow-build-rows">
    <el-table v-if="runnerTests.length > 0"
              :data="runnerTests"
              empty-text="无"
              class="test-table">
      <el-table-column prop="test_module_name"
                       label="测试"
                       width="100px"></el-table-column>

      <el-table-column label="代码库">
        <template slot-scope="scope">
          <el-row v-for="build of scope.row.builds"
                  class="build-row"
                  :key="build._id_">
            <template v-if="!build.use_default">
              <el-col :span="7">
                <div class="repo-name-container">
                  <span :class="{'repo-name': true}"> {{
              $utils.tailCut(build.repo_name,20) }}</span>
                </div>
              </el-col>
              <template>
                <el-col :span="7">
                  <el-select v-if="build.branches && build.branches.length > 0"
                             v-model="build.branch"
                             filterable
                             remote
                             :remote-method="(key)=> queryBranchInfo(build, key)"
                             allow-create
                             clearable
                             size="small"
                             placeholder="请选择分支">
                    <el-option v-for="branch of build.branches"
                               :key="branch.name"
                               :label="branch.name"
                               :value="branch.name"></el-option>
                  </el-select>
                  <el-tooltip v-else
                              content="请求分支失败，请手动输入分支"
                              placement="top"
                              popper-class="gray-popper">
                    <el-input v-model="build.branch"
                              class="short-input"
                              size="small"
                              placeholder="请填写分支"></el-input>
                  </el-tooltip>
                </el-col>
              </template>
              <template>
                <el-col :span="7"
                        :offset="1">
                  <el-select v-if="!$utils.isEmpty(build.branchPRsMap)"
                             v-model.number="build[build.prNumberPropName]"
                             size="small"
                             placeholder="请选择 PR"
                             filterable
                             clearable>

                    <el-tooltip v-for="item in build.branchPRsMap[build.branch]"
                                :key="item[build.prNumberPropName]"
                                placement="left"
                                popper-class="gray-popper">

                      <div slot="content">{{`创建人: ${$utils.tailCut(item.authorUsername,10)}`}}
                        <br />{{`时间: ${$utils.convertTimestamp(item.createdAt)}`}}
                        <br />{{`源分支: ${item.sourceBranch}`}}
                        <br />{{`目标分支: ${item.targetBranch}`}}
                      </div>
                      <el-option :label="`#${item[build.prNumberPropName]} ${item.title}`"
                                 :value="item[build.prNumberPropName]">
                      </el-option>
                    </el-tooltip>
                  </el-select>
                  <el-tooltip v-else
                              content="PR 不存在，支持手动输入 PR 号"
                              placement="top"
                              popper-class="gray-popper">
                    <el-input v-model.number="build[build.prNumberPropName]"
                              class="short-input"
                              size="small"
                              placeholder="请填写 PR 号"></el-input>
                  </el-tooltip>
                  <el-tooltip v-if="build.errorMsg"
                              class="item"
                              effect="dark"
                              :content="build.errorMsg"
                              placement="top">
                    <i class="el-icon-question repo-warning"></i>
                  </el-tooltip>
                </el-col>
              </template>
            </template>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column width="250px">
      </el-table-column>
      <el-table-column width="100px"
                       label="环境变量">
        <template slot-scope="scope">
          <el-popover placement="left"
                      width="450"
                      trigger="click">
            <el-table :data="scope.row.envs">
              <el-table-column property="key"
                               label="Key"></el-table-column>
              <el-table-column label="Value">
                <template slot-scope="scope">
                  <el-input size="small"
                            v-model="scope.row.value"
                            placeholder="请输入 value"></el-input>
                </template>
              </el-table-column>
            </el-table>
            <el-button style="padding: 5px 0;"
                       slot="reference"
                       type="text">设置</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getBranchInfoByIdAPI } from '@api'

export default {
  data () {
    return {
    }
  },
  methods: {
    changeReleaseMethod (repo) {
      repo.tag = ''
      repo.branch = ''
    },
    async queryBranchInfo (repo, key) {
      const repoUUID = repo.repo_uuid ? repo.repo_uuid : ''
      const res = await getBranchInfoByIdAPI(repo.codehost_id, repo.repo_owner, repo.repo_name, repoUUID, key).catch(error => console.log(error))
      if (res) {
        repo.branches = res
      }
    },
    getBranchInfoById (repos) {
      repos.forEach(async (repo) => {
        const repoUUID = repo.repo_uuid ? repo.repo_uuid : ''
        this.$set(repo, 'branches', [])

        if (repo.repo_owner && repo.repo_name) {
          const res = await getBranchInfoByIdAPI(repo.codehost_id, repo.repo_owner, repo.repo_name, repoUUID).catch(error => console.log(error))
          if (res) {
            repo.branches = res
          }
        }
      })
    }
  },
  props: {
    runnerTests: {
      type: Array,
      required: true
    }
  },
  watch: {
    runnerTests: {
      handler (value) {
        console.log(value)
        value.forEach((item) => {
          if (item.builds) {
            this.getBranchInfoById(item.builds)
          }
        })
      },
      immediate: true

    }
  }
}
</script>

<style lang="less">
@import '~@assets/css/common/build-row.less';
</style>
