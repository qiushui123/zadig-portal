<template>
    <div class="form-content">
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="form"
        label-position="left"
      >
        <el-form-item label="环境名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="集群">
          <el-select placeholder="请选择集群">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select placeholder="命名空间">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="transfer-title">服务列表</div>
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入服务名称"
        v-model="value"
        :titles="['服务列表', '已选服务']"
        :data="data"
        class="transfer"
      >
      </el-transfer>
    </div>
</template>
<script>
export default {
  name: 'host_env_config',
  data () {
    const generateData = (_) => {
      const data = []
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都']
      const pinyin = [
        'shanghai',
        'beijing',
        'guangzhou',
        'shenzhen',
        'nanjing',
        'xian',
        'chengdu'
      ]
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index]
        })
      })
      return data
    }
    return {
      form: {},
      rules: {},
      data: generateData(),
      value: [],
      filterMethod (query, item) {
        return item.pinyin.indexOf(query) > -1
      }
    }
  }
}
</script>
<style lang='less' scoped>
  .form-content {
    height: 100%;
    padding-left: 100px;
    background-color: #ffffff;

    .form {
      width: 500px;
      margin-top: 30px;

      /deep/ .el-select {
        width: 100%;
      }
    }

    /deep/ .el-transfer-panel {
      width: 360px;
    }

    .transfer {
      margin-bottom: 20px;
    }

    .transfer-title {
      margin-bottom: 20px;
      color: #606266;
      font-size: 14px;
    }
  }
</style>
