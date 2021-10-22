import { keyBy } from 'lodash'

const permissions = [
  {
    name: '工作流',
    subPermissions: [
      {
        name: '查看工作流',
        uuid: '30005'
      },
      {
        name: '创建工作流',
        uuid: '30003'
      },
      {
        name: '编辑工作流',
        uuid: '30002'
      },
      {
        name: '复制工作流',
        uuid: '30003'
      },
      {
        name: '删除工作流',
        uuid: '30004'
      },
      {
        name: '执行工作流',
        uuid: '30001'
      },
      {
        name: '克隆任务',
        uuid: '30007'
      }
    ]
  },
  {
    name: '集成环境',
    subPermissions: [
      {
        name: '查看集成环境',
        uuid: '40004'
      },
      {
        name: '创建集成环境',
        uuid: '40001'
      },
      {
        name: '管理集成环境',
        uuid: '40003'
      },
      {
        name: '更新镜像/重启实例',
        uuid: '40010'
      },
      {
        name: '删除集成环境',
        uuid: '40002'
      },
      {
        name: '环境授权',
        uuid: '40005'
      }
    ]
  },
  {
    name: '集成环境(类生产/预发布)',
    subPermissions: [
      {
        name: '查看集成环境',
        uuid: '40006',
        row: 'prod'
      },
      {
        name: '创建集成环境',
        uuid: '40007',
        row: 'prod'
      },
      {
        name: '管理集成环境',
        uuid: '40008',
        row: 'prod'
      },
      {
        name: '删除集成环境',
        uuid: '40009',
        row: 'prod'
      }
    ]
  },
  {
    name: '项目配置',
    subPermissions: [
      {
        name: '查看服务',
        uuid: '50025',
        row: 'service'
      },
      {
        name: '编辑服务',
        uuid: '50023',
        row: 'service'
      },
      {
        name: '删除服务',
        uuid: '50024',
        row: 'service'
      },
      {
        name: '编排服务',
        uuid: '50022',
        row: 'service'
      },
      {
        name: '查看构建配置',
        uuid: '50019',
        row: 'build'
      },
      {
        name: '编辑构建配置',
        uuid: '50008',
        row: 'build'
      },
      {
        name: '删除构建配置',
        uuid: '50007',
        row: 'build'
      }
    ]
  },
  {
    name: '质量管理',
    subPermissions: [
      {
        name: '持续集成度量',
        uuid: '50021',
        row: 'ci'
      },
      {
        name: '查看测试管理',
        uuid: '50020',
        row: 'test'
      },
      {
        name: '编辑测试配置',
        uuid: '50011',
        row: 'test'
      },
      {
        name: '删除测试配置',
        uuid: '50010',
        row: 'test'
      }
    ]
  },
  {
    name: '交付中心',
    subPermissions: [
      {
        name: '删除版本',
        uuid: '70001'
      },
      {
        name: '创建版本',
        uuid: '30006'
      }
    ]
  }
]

const systemPermission = permissions.filter(per => per.name !== '项目配置')

const permissionObj = {}

for (const per of permissions) {
  permissionObj[per.name] = { name: per.name, subPermissions: keyBy(per.subPermissions, 'name') }
}

/**
 * 可获取 uuid 的函数，项目其他地方可直接使用
 * @param {string} key
 * @param {string} subKey
 * @returns string
 *
 */
function getUuid (key, subKey) {
  return permissionObj[key].subPermissions[subKey].uuid
}

// 路由用的 uuid 来自这里
const pagePermission = {
  pipeline: getUuid('工作流', '查看工作流'), // '30005',  // 查看工作流
  build: getUuid('项目配置', '查看构建配置'), // '50019',   // 查看构建配置
  test: getUuid('质量管理', '查看测试管理'), // '50020',  // 查看测试管理
  service: getUuid('项目配置', '查看服务'), // '50025',   // 查看服务
  env: [getUuid('集成环境', '查看集成环境'), getUuid('集成环境(类生产/预发布)', '查看集成环境')], // 40004 40006 查看集成环境
  isPublic: false // or true
}

export {
  permissions,
  systemPermission,
  permissionObj,
  getUuid,
  pagePermission
}
