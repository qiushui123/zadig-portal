<template>
  <div class="auditlog-container">
    <el-dialog :title="`API 请求：${currentLog.time}`"
               :visible.sync="payloadDialogVisiable"
               width="500px">

      <div>
        <vue-json-pretty v-if="currentLog.request_body"
                         :data="currentLog.request_body">
        </vue-json-pretty>
        <p v-if="currentLog.request_body ===''">暂无请求 Payload 信息</p>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   size="small"
                   @click="payloadDialogVisiable = false">确 定</el-button>
      </span>
    </el-dialog>
    <div class="section">
      <div class="function-container">
        <div class="type">
          <el-select v-model="searchType"
                     size="small"
                     placeholder="请选择查询类型">
            <el-option label="用户名"
                       value="username">
            </el-option>
            <el-option label="项目"
                       value="product_name">
            </el-option>
            <el-option label="功能"
                       value="function">
            </el-option>
            <el-option label="状态码"
                       value="status">
            </el-option>
          </el-select>

        </div>

        <div class="keyword">
          <el-input clearable
                    size="small"
                    v-model="keyword"
                    @keyup.enter.native="getAuditLogBySearch"
                    placeholder="请输入关键字"></el-input>
        </div>

        <el-button plain
                   size="small"
                   @click="getAuditLogBySearch"
                   type="primary">查询</el-button>
      </div>
      <div class="storage-list">
        <template>
          <el-table :data="results"
                    v-loading="loading"
                    element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    style="width: 100%;">
            <el-table-column width="160px"
                             label="时间">
              <template slot-scope="scope">
                {{$utils.convertTimestamp(scope.row.created_at,'yyyy-mm-dd-ss')}}
              </template>
            </el-table-column>
            <el-table-column label="用户名">
              <template slot-scope="scope">
                {{scope.row.username}}
              </template>
            </el-table-column>
            <el-table-column width="100px"
                             label="操作">
              <template slot-scope="scope">
                {{scope.row.method}}
              </template>
            </el-table-column>
            <el-table-column label="项目">
              <template slot-scope="scope">
                {{scope.row.product_name}}
              </template>
            </el-table-column>
            <el-table-column label="功能">
              <template slot-scope="scope">
                {{scope.row.function}}
              </template>
            </el-table-column>
            <el-table-column label="详情">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column width="100px"
                             label="状态码">
              <template slot-scope="scope">
                <el-tag effect="dark"
                        :type="getStatusColor(scope.row.status)"
                        size="small">
                  {{scope.row.status}}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column width="100px"
                             label="API 请求">
              <template slot-scope="scope">
                <el-button @click="viewRequestPayload(scope.row)"
                           icon="el-icon-document"
                           type="text"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!--start of page-divide -->
      <div class="log-table-pagination">
        <el-pagination background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPageList"
                       :page-sizes="[50, 100,150, 200]"
                       :page-size="logPageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="totalLog">
        </el-pagination>
      </div>
      <!--page divide-->
    </div>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import { getAuditLogAPI } from '@api'
import bus from '@utils/event_bus'
export default {
  data () {
    return {
      results: [],
      loading: false,
      payloadDialogVisiable: false,
      searchType: 'username',
      keyword: '',
      currentLog: {
        request_body: ''
      },
      editorOption: {
        showLineNumbers: true,
        showFoldWidgets: true,
        showGutter: true,
        displayIndentGuides: true,
        showPrintMargin: false,
        readOnly: true,
        tabSize: 2,
        maxLines: Infinity
      },
      totalLog: 0,
      logPageSize: 50,
      currentPageList: 1
    }
  },
  methods: {
    getAuditLogBySearch () {
      this.currentPageList = 1
      this.getAuditLog('', this.pageSize, this.currentPageList)
    },
    getAuditLog (type, pageSize, pageList) {
      this.loading = true
      const payload = {
        username: this.searchType === 'username' ? this.keyword : '',
        product_name: this.searchType === 'product_name' ? this.keyword : '',
        status: this.searchType === 'status' ? Number(this.keyword) : 0,
        function: this.searchType === 'function' ? this.keyword : '',
        per_page: pageSize,
        page: pageList
      }
      getAuditLogAPI(payload).then((res) => {
        this.results = []
        this.loading = false
        this.totalLog = Number(res.headers['x-total'])
        this.results = res.data
        if (type !== 'init') {
          this.$message({
            message: '查询完毕',
            type: 'success'
          })
        }
      }, () => {
        this.loading = false
      })
    },
    getStatusColor (status) {
      if (status > 0 && status <= 299) {
        return 'success'
      } else if (status >= 400) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    viewRequestPayload (request) {
      this.payloadDialogVisiable = true
      this.currentLog.time = this.$utils.convertTimestamp(request.created_at)
      this.currentLog.username = request.username
      this.currentLog.function = request.function
      if (request.request_body) {
        this.currentLog.request_body = JSON.parse(request.request_body)
      } else {
        this.currentLog.request_body = ''
      }
    },
    handleSizeChange (val) {
      this.logPageSize = val
      this.getAuditLog('init', this.logPageSize, this.currentPageList)
    },
    handleCurrentChange (val) {
      this.currentPageList = val
      this.getAuditLog('init', this.logPageSize, this.currentPageList)
    }
  },
  computed: {

  },
  components: {
    VueJsonPretty
  },
  created () {
    bus.$emit(`set-topbar-title`, { title: '操作日志', breadcrumb: [] })
    bus.$emit(`set-sub-sidebar-title`, {
      title: '',
      routerList: []
    })
    this.getAuditLog('init', this.logPageSize, this.currentPageList)
  }
}
</script>

<style lang="less">
.auditlog-container {
  position: relative;
  flex: 1;
  padding: 15px 30px;
  overflow: auto;
  font-size: 13px;

  .module-title h1 {
    margin-bottom: 1.5rem;
    font-weight: 200;
    font-size: 2rem;
  }

  .section {
    margin-bottom: 56px;

    .function-container {
      .type {
        display: inline-block;
        width: 120px;
      }

      .keyword {
        display: inline-block;
        width: 400px;
      }
    }

    .log-table-pagination {
      margin-top: 15px;
    }
  }
}
</style>
