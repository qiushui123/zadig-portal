// key跟后端保持同步，value存在数据库不要乱改!!!
export const get_workflow = 'workflow/getWorkflow'
export const edit_workflow = 'workflow/editWorkflow'
export const create_workflow = 'workflow/createWorkflow'
export const delete_workflow = 'workflow/deleteWorkflow'
export const run_workflow = 'workflow/runWorkflow'

export const get_environment = 'environment/getEnvironment'
export const create_environment = 'environment/createEnvironment'
export const config_environment = 'environment/configEnvironment'
export const manage_environment = 'environment/manageEnvironment'
export const delete_environment = 'environment/deleteEnvironment'

export const get_service = 'service/getService'
export const edit_service = 'service/editService'
export const create_service = 'service/createService'
export const delete_service = 'service/deleteService'
export const get_build = 'build/getBuild'
export const create_build = 'build/createBuild'
export const edit_build = 'build/editBuild'
export const delete_build = 'build/deleteBuild'

export const get_test = 'test/getTest'
export const edit_test = 'test/editTest'
export const delete_test = 'test/deleteTest'
export const create_test = 'test/createTest'

export const get_delivery = 'delivery/getDelivery'
export const delete_delivery = 'delivery/deleteDelivery'

export const permissionParams = [
  {
    endpoint: get_workflow,
    method: 'VIEW'
  },
  {
    endpoint: edit_workflow,
    method: 'VIEW'
  },
  {
    endpoint: create_workflow,
    method: 'VIEW'
  },
  {
    endpoint: delete_workflow,
    method: 'VIEW'
  },
  {
    endpoint: run_workflow,
    method: 'VIEW'
  },
  {
    endpoint: get_environment,
    method: 'VIEW'
  },
  {
    endpoint: create_environment,
    method: 'VIEW'
  },
  {
    endpoint: config_environment,
    method: 'VIEW'
  },
  {
    endpoint: manage_environment,
    method: 'VIEW'
  },
  {
    endpoint: delete_environment,
    method: 'VIEW'
  },
  {
    endpoint: get_service,
    method: 'VIEW'
  },
  {
    endpoint: edit_service,
    method: 'VIEW'
  },
  {
    endpoint: create_service,
    method: 'VIEW'
  },
  {
    endpoint: delete_service,
    method: 'VIEW'
  },
  {
    endpoint: get_build,
    method: 'VIEW'
  },
  {
    endpoint: create_build,
    method: 'VIEW'
  },
  {
    endpoint: edit_build,
    method: 'VIEW'
  },
  {
    endpoint: delete_build,
    method: 'VIEW'
  },
  {
    endpoint: get_build,
    method: 'VIEW'
  },
  {
    endpoint: create_build,
    method: 'VIEW'
  },
  {
    endpoint: edit_build,
    method: 'VIEW'
  },
  {
    endpoint: delete_build,
    method: 'VIEW'
  },
  {
    endpoint: get_build,
    method: 'VIEW'
  }
]
