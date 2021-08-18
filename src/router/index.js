import Vue from 'vue'
import VueRouter from 'vue-router'

// sign
import signin from '../components/entry/login.vue'

// 404
import not_found from '../components/entry/404.vue'

// setup
import setup_admin from '../components/setup/admin.vue'

// loading
import loading from '../components/entry/loading.vue'

// home
import onboarding_home from '../components/entry/home.vue'

// status
import workflow_status from '../components/projects/status/status.vue'

// project
import onboarding_projects_home from '../components/projects/detail_ope/home.vue'
import onboarding_projects_create from '../components/projects/detail_ope/create.vue'
import onboarding_projects_detail from '../components/projects/detail_ope/detail.vue'

// services

// service mgr
import project_service from '../components/projects/service_mgr/service.vue'

// workflow
import onboarding_projects_pipelines from '../components/projects/pipeline/workflow_list.vue'
import workflow_multi_detail from '../components/projects/pipeline/workflow_multi_detail.vue'
import workflow_multi_task from '../components/projects/pipeline/workflow_multi_task_detail.vue'
import workflow_multi_testcase from '../components/projects/test/report/workflow_multi_test_case.vue'

// build
import project_build_config from '../components/projects/build/config.vue'
import project_build_config_detail from '../components/projects/build/config_detail.vue'
/** ---------------- */

/**     profile      */

import profile_home from '../components/profile/home.vue'
import profile_manage from '../components/profile/manage.vue'

// workflow product
const configure_pipeline_view = () => import(/* webpackChunkName: "edit-pipeline" */ '../components/projects/edit_pipeline/view.vue')
const product_pipeline = () => import(/* webpackChunkName: "edit-pipeline" */ '../components/projects/edit_pipeline/product_pipeline/pipeline.vue')

/* env
   outside */
const env_home = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/outer_env/home.vue')
const env_detail = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/outer_env/env_detail.vue')

// inside
const project_env_home = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/home.vue')
const project_env_detail = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/env_detail.vue')
const project_env_create = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/create_env_detail.vue')
const project_env_service_detail = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/service_detail.vue')
const project_env_pm_service_detail = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/pm_service_detail.vue')
const project_env_service_config = () => import(/* webpackChunkName: "project-env" */ '../components/projects/env/inner_env/service_config.vue')

// test
const project_test_function = () => import(/* webpackChunkName: "project-test" */ '../components/projects/test/function/function.vue')
const project_test_function_summary = () => import(/* webpackChunkName: "project-test" */ '../components/projects/test/function/function_summary.vue')
const project_test_function_detail = () => import(/* webpackChunkName: "project-test" */ '../components/projects/test/function/function_detail.vue')
const project_test_function_task_detail = () => import(/* webpackChunkName: "project-test" */ '../components/projects/test/function/function_task_detail.vue')
const project_test_case = () => import(/* webpackChunkName: "project-test" */ '../components/projects/test/report/test_case.vue')

// test mgr
const test_home_first = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/first.vue')
const test_function = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/function/function.vue')
const test_function_detail = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/function/function_detail.vue')
const test_function_summary = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/function/function_summary.vue')
const test_function_task_detail = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/function/function_task_detail.vue')
const test_case = () => import(/* webpackChunkName: "quality-manage" */ '../components/quality_manage/tests/test_case.vue')

// delivery center
const delivery_home = () => import(/* webpackChunkName: "project-delivery" */ '../components/projects/delivery/home.vue')
const delivery_version = () => import(/* webpackChunkName: "project-delivery" */ '../components/projects/delivery/version/index.vue')
const delivery_version_detail = () => import(/* webpackChunkName: "project-delivery" */ '../components/projects/delivery/version/detail.vue')
const delivery_artifacts = () => import(/* webpackChunkName: "project-delivery" */ '../components/projects/delivery/artifacts/index.vue')
const delivery_artifacts_detail = () => import(/* webpackChunkName: "project-delivery" */ '../components/projects/delivery/artifacts/detail.vue')

/**    onboarding    */
// k8s
const onboarding_projects_info_basic = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/k8s/info_basic.vue')
const onboarding_projects_service = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/service.vue')
const onboarding_projects_runtime = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/runtime.vue')
const onboarding_projects_delivery = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/k8s/delivery.vue')

// helm
const onboarding_projects_info_helm = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/helm/info_basic.vue')
const onboarding_projects_runtime_helm = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/helm/runtime.vue')
const onboarding_projects_delivery_helm = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/helm/delivery.vue')

// not k8s
const onboarding_projects_not_k8s_info = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/not_k8s/not_k8s_info.vue')
const onboarding_projects_not_k8s_config = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/not_k8s/not_k8s_config.vue')
const onboarding_projects_not_k8s_deploy = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/not_k8s/not_k8s_deploy.vue')
const onboarding_projects_not_k8s_delivery = () => import(/* webpackChunkName: "onboarding" */ '../components/projects/guide/not_k8s/not_k8s_delivery.vue')

/** ---------------- */

/**   enterprise    */
const enterprise_mgr_home = () => import(/* webpackChunkName: "enterprise-mgr" */ '../components/enterprise_mgr/home.vue')
const enterprise_mgr_users_manage = () => import(/* webpackChunkName: "enterprise-mgr" */ '../components/enterprise_mgr/users/manage.vue')

/** ---------------- */

/**   system setting      */
const setting_home = () => import(/* webpackChunkName: "setting" */ '../components/setting/home.vue')

const setting_integration_manage_home = () => import(/* webpackChunkName: "setting" */ '../components/setting/integration/home.vue')
const setting_apps_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/apps/manage.vue')
const setting_imgs_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/imgs/manage.vue')
const setting_registry_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/registry/manage.vue')
const setting_storage_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/storage/manage.vue')
const setting_cluster_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/cluster/manage.vue')
const setting_host_manage = () => import(/* webpackChunkName: "setting" */ '../components/setting/host/manage.vue')
const setting_config_manage_home = () => import(/* webpackChunkName: "setting" */ '../components/setting/config/home.vue')
const setting_config_manage_quota = () => import(/* webpackChunkName: "setting" */ '../components/setting/config/quota.vue')
const setting_config_manage_proxy = () => import(/* webpackChunkName: "setting" */ '../components/setting/config/proxy.vue')
const setting_config_manage_cache = () => import(/* webpackChunkName: "setting" */ '../components/setting/config/cache.vue')

/** ---------------- */

// mobile
const mobile = () => import(/* webpackChunkName: "mobile" */ '../mobile/index.vue')
const mobile_status = () => import(/* webpackChunkName: "mobile" */ '../mobile/pipelines/status.vue')
const mobile_envs = () => import(/* webpackChunkName: "mobile" */ '../mobile/envs/envs.vue')
const mobile_env_detail = () => import(/* webpackChunkName: "mobile" */ '../mobile/envs/env_detail')
const mobile_env_service_detail = () => import(/* webpackChunkName: "mobile" */ '../mobile/envs/service_detail')
const mobile_pipelines = () => import(/* webpackChunkName: "mobile" */ '../mobile/pipelines/pipelines.vue')
const mobile_pipelines_detail = () => import(/* webpackChunkName: "mobile" */ '../mobile/pipelines/detail.vue')
const mobile_pipelines_multi_task = () => import(/* webpackChunkName: "mobile" */ '../mobile/pipelines/multi_task.vue')
const mobile_profile = () => import(/* webpackChunkName: "mobile" */ '../mobile/profile.vue')

Vue.use(VueRouter)
const routes = [
  {
    path: '/v1',
    component: onboarding_home,
    meta: {},
    children: [
      {
        path: 'status',
        component: workflow_status,
        meta: {
          requiresAuth: true,
          title: '运行状态'
        }
      },
      {
        path: 'projects',
        component: onboarding_projects_home,
        meta: {
          requiresAuth: true,
          title: '项目列表'
        }
      },
      {
        path: 'envs',
        component: env_home,
        meta: {
          requiresAuth: true,
          title: '集成环境'
        },
        children: [
          {
            path: 'detail/:project_name',
            component: env_detail,
            meta: {
              requiresAuth: true,
              title: '集成环境'
            }
          },
          {
            path: 'detail/:project_name/:service_name',
            component: project_env_service_detail,
            meta: {
              requiresAuth: true,
              title: '服务详情'
            }
          },
          {
            path: 'detail/:project_name/:service_name/pm',
            component: project_env_pm_service_detail,
            meta: {
              requiresAuth: true,
              title: '服务详情'
            }
          },
          {
            path: 'detail/:project_name/:service_name/config',
            component: project_env_service_config,
            meta: {
              requiresAuth: true,
              title: '配置详情'
            }
          }
        ]
      },
      {
        path: 'pipelines',
        component: onboarding_projects_pipelines,
        meta: {
          requiresAuth: true,
          title: '工作流'
        }
      },
      {
        path: 'projects/create',
        component: onboarding_projects_create,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/basic/info',
        component: onboarding_projects_info_basic,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/basic/service',
        component: onboarding_projects_service,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/basic/runtime',
        component: onboarding_projects_runtime,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/basic/delivery',
        component: onboarding_projects_delivery,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/helm/info',
        component: onboarding_projects_info_helm,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/helm/service',
        component: () => import('@/components/projects/guide/service_helm_guide'),
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/helm/runtime',
        component: onboarding_projects_runtime_helm,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/helm/delivery',
        component: onboarding_projects_delivery_helm,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/not_k8s/info',
        component: onboarding_projects_not_k8s_info,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/not_k8s/config',
        component: onboarding_projects_not_k8s_config,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/not_k8s/deploy',
        component: onboarding_projects_not_k8s_deploy,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/create/:project_name/not_k8s/delivery',
        component: onboarding_projects_not_k8s_delivery,
        meta: {
          requiresAuth: true,
          title: '新建项目'
        }
      },
      {
        path: 'projects/edit/:project_name',
        component: onboarding_projects_create,
        meta: {
          requiresAuth: true,
          title: '修改项目'
        }
      },
      {
        path: 'projects/detail/:project_name',
        component: onboarding_projects_detail,
        meta: {
          requiresAuth: true,
          title: '项目详情'
        }
      },
      {
        path: 'projects/detail/:project_name/pipelines',
        component: onboarding_projects_pipelines,
        meta: {
          requiresAuth: true,
          title: '工作流'
        }
      },
      {
        path: 'projects/detail/:project_name/services',
        component: project_service,
        meta: {
          requiresAuth: true,
          title: '服务管理'
        }
      },
      {
        path: 'projects/detail/:project_name/builds',
        component: project_build_config,
        meta: {
          requiresAuth: true,
          title: '构建'
        }
      },
      {
        path: 'projects/detail/:project_name/builds/create',
        component: project_build_config_detail,
        meta: {
          requiresAuth: true,
          title: '新建构建'
        }
      },
      {
        path: 'projects/detail/:project_name/builds/detail/:build_name/:version',
        component: project_build_config_detail,
        meta: {
          requiresAuth: true,
          title: '构建详情'
        }
      },
      {
        path: 'projects/detail/:project_name/envs',
        component: project_env_home,
        meta: {
          requiresAuth: true,
          title: '集成环境'
        },
        children: [
          {
            path: 'create',
            component: project_env_create,
            meta: {
              requiresAuth: true,
              title: '创建环境'
            }
          },
          {
            path: 'detail',
            component: project_env_detail,
            meta: {
              requiresAuth: true,
              title: '集成环境'
            }
          },
          {
            path: 'detail/:service_name',
            component: project_env_service_detail,
            meta: {
              requiresAuth: true,
              title: '服务详情'
            }
          },
          {
            path: 'detail/:service_name/pm',
            component: project_env_pm_service_detail,
            meta: {
              requiresAuth: true,
              title: '服务详情'
            }
          },
          {
            path: 'detail/:service_name/config',
            component: project_env_service_config,
            meta: {
              requiresAuth: true,
              title: '配置详情'
            }
          }
        ]
      },
      {
        path: 'projects/detail/:project_name/pipelines/multi/:workflow_name',
        component: workflow_multi_detail,
        meta: {
          requiresAuth: true,
          title: '工作流详情'
        }
      },
      {
        path: 'projects/detail/:project_name/pipelines/multi/:workflow_name/:task_id',
        component: workflow_multi_task,
        meta: {
          requiresAuth: true,
          title: '任务详情'
        }
      },
      {
        path: 'projects/detail/:project_name/pipelines/multi/testcase/:workflow_name/:task_id/:test_name/:test_job_name',
        component: workflow_multi_testcase,
        meta: {
          requiresAuth: true,
          title: '测试报告'
        }
      },
      {
        path: 'projects/detail/:project_name/test',
        component: project_test_function,
        meta: {
          requiresAuth: true,
          title: '功能测试'
        }
      },
      {
        path: 'projects/detail/:project_name/test/function',
        component: project_test_function,
        meta: {
          requiresAuth: true,
          title: '功能测试'
        }
      },
      {
        path: 'projects/detail/:project_name/test/function/:test_name',
        component: project_test_function_detail,
        meta: {
          requiresAuth: true,
          title: '功能测试'
        }
      },
      {
        path: 'projects/detail/:project_name/test/add/function',
        component: project_test_function_detail,
        meta: {
          requiresAuth: true,
          title: '功能测试-添加'
        }
      },
      {
        path: 'projects/detail/:project_name/test/detail/function/:test_name',
        component: project_test_function_summary,
        meta: {
          requiresAuth: true,
          title: '功能测试-详情统计'
        }
      },
      {
        path: 'projects/detail/:project_name/test/detail/function/:test_name/:task_id',
        component: project_test_function_task_detail,
        meta: {
          requiresAuth: true,
          title: '功能测试-任务详情'
        }
      },
      {
        path: 'projects/detail/:project_name/test/testcase/function/:workflow_name/:task_id/:test_name',
        component: project_test_case,
        meta: {
          requiresAuth: true,
          title: '功能测试-测试报告'
        }
      },
      {
        path: 'projects/detail/:project_name/test/testcase/function/:workflow_name/:task_id/test/:test_name',
        component: project_test_case,
        meta: {
          requiresAuth: true,
          title: '功能测试-测试报告'
        }
      }
    ]
  },
  {
    path: '/setup',
    component: setup_admin,
    meta: {
      title: '系统初始化'
    }
  },
  {
    path: '/loading',
    component: loading
  },
  {
    path: '/v1/tests',
    component: onboarding_home,
    meta: {
      requiresAuth: true,
      title: '测试管理'
    },
    children: [
      {
        path: '',
        component: test_home_first,
        meta: {
          requiresAuth: true,
          title: '测试'
        }
      },
      {
        path: 'detail/:project_name/test',
        component: test_home_first,
        meta: {
          requiresAuth: true,
          title: '测试管理'
        },
        children: [
          {
            path: 'function',
            component: test_function,
            meta: {
              requiresAuth: true,
              title: '功能测试'
            }
          },
          {
            path: 'function/:test_name',
            component: test_function_detail,
            meta: {
              requiresAuth: true,
              title: '功能测试'
            }
          },
          {
            path: 'add/function',
            component: test_function_detail,
            meta: {
              requiresAuth: true,
              title: '功能测试-添加'
            }
          },
          {
            path: 'detail/function/:test_name',
            component: test_function_summary,
            meta: {
              requiresAuth: true,
              title: '功能测试-详情统计'
            }
          },
          {
            path: 'detail/function/:test_name/:task_id',
            component: test_function_task_detail,
            meta: {
              requiresAuth: true,
              title: '功能测试-任务详情'
            }
          },
          {
            path: 'testcase/function/:workflow_name/:task_id/:test_name',
            component: test_case,
            meta: {
              requiresAuth: true,
              title: '功能测试-测试报告'
            }
          },
          {
            path: 'testcase/function/:workflow_name/:task_id/test/:test_name',
            component: test_case,
            meta: {
              requiresAuth: true,
              title: '功能测试-测试报告'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/v1/delivery',
    component: onboarding_home,
    meta: {
      requiresAuth: true,
      requiresSuperAdmin: false,
      title: '交付中心'
    },
    children: [
      {
        path: '',
        component: delivery_home
      },
      {
        path: 'version',
        component: delivery_home,
        children: [
          {
            path: ':project_name',
            component: delivery_version,
            meta: {
              requiresAuth: true,
              requiresSuperAdmin: false,
              title: '版本管理'
            }
          },
          {
            path: ':project_name/:id',
            component: delivery_version_detail,
            meta: {
              requiresAuth: true,
              requiresSuperAdmin: false,
              title: '版本详情'
            }
          }
        ]
      },
      {
        path: 'artifacts',
        component: delivery_artifacts,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: false,
          title: '交付物追踪'
        }
      },
      {
        path: 'artifacts/detail/:id',
        component: delivery_artifacts_detail,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: false,
          title: '交付物追踪'
        }
      }
    ]
  },
  {
    path: '/productpipelines',
    component: configure_pipeline_view,
    meta: {
      requiresAuth: true,
      title: '工作流管理'
    },
    children: [
      {
        path: 'create',
        component: product_pipeline,
        meta: {
          requiresAuth: true,
          title: '新建工作流'
        }
      },
      {
        path: 'edit/:name',
        component: product_pipeline,
        meta: {
          requiresAuth: true,
          title: '编辑工作流'
        }
      }
    ]
  },
  {
    path: '/v1/enterprise',
    component: onboarding_home,
    meta: {
      requiresAuth: true,
      requiresSuperAdmin: true,
      title: '用户管理'
    },
    children: [
      {
        path: '',
        component: enterprise_mgr_home,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '用户管理'
        }
      },
      {
        path: 'users/manage',
        component: enterprise_mgr_users_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '用户管理'
        }
      }
    ]
  },
  {
    path: '/v1/profile',
    component: onboarding_home,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: profile_home,
        meta: {
          requiresAuth: true,
          title: '用户设置'
        }
      },
      {
        path: 'info',
        component: profile_manage,
        meta: {
          requiresAuth: true,
          title: '用户设置'
        }
      }
    ]
  },
  {
    path: '/v1/system',
    component: onboarding_home,
    meta: {
      requiresAuth: true,
      requiresSuperAdmin: false
    },
    children: [
      {
        path: '',
        component: setting_home,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '系统设置'
        }
      },
      {
        path: 'apps',
        component: setting_apps_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '应用设置'
        }
      },
      {
        path: 'imgs',
        component: setting_imgs_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '构建镜像管理'
        }
      },
      {
        path: 'registry',
        component: setting_registry_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '镜像仓库'
        }
      },
      {
        path: 'storage',
        component: setting_storage_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '对象存储'
        }
      },
      {
        path: 'cluster',
        component: setting_cluster_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '集群管理'
        }
      },
      {
        path: 'host',
        component: setting_host_manage,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '主机管理'
        }
      },
      {
        path: 'integration',
        component: setting_integration_manage_home,
        meta: {
          requiresAuth: true,
          title: '集成管理'
        }
      },
      {
        path: 'config',
        component: setting_config_manage_home,
        meta: {
          requiresAuth: true,
          requiresSuperAdmin: true,
          title: '系统配置'
        },
        children: [
          {
            path: 'manage/quota',
            component: setting_config_manage_quota,
            meta: {
              requiresAuth: true,
              requiresSuperAdmin: true,
              title: '系统配额'
            }
          },
          {
            path: 'manage/proxy',
            component: setting_config_manage_proxy,
            meta: {
              requiresAuth: true,
              requiresSuperAdmin: true,
              title: '代理配置'
            }
          },
          {
            path: 'manage/cache',
            component: setting_config_manage_cache,
            meta: {
              requiresAuth: true,
              requiresSuperAdmin: true,
              title: '缓存清理'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/mobile',
    component: mobile,
    meta: {
      title: 'Zadig'
    },
    children: [
      {
        path: 'status',
        component: mobile_status,
        meta: {
          requiresAuth: true,
          title: '运行状态'
        }
      },
      {
        path: 'envs',
        component: mobile_envs,
        meta: {
          requiresAuth: true,
          title: '集成环境'
        }
      },
      {
        path: 'envs/detail/:project_name',
        component: mobile_env_detail,
        meta: {
          requiresAuth: true,
          title: '集成环境'
        }
      },
      {
        path: 'envs/detail/:project_name/:service_name',
        component: mobile_env_service_detail,
        meta: {
          requiresAuth: true,
          title: '服务详情'
        }
      },
      {
        path: 'pipelines',
        component: mobile_pipelines,
        meta: {
          requiresAuth: true,
          title: '工作流'
        }
      },
      {
        path: 'pipelines/project/:project_name/multi/:workflow_name/:task_id',
        component: mobile_pipelines_multi_task,
        meta: {
          requiresAuth: true,
          title: '任务详情'
        }
      },
      {
        path: 'pipelines/project/:project_name/multi/:workflow_name',
        component: mobile_pipelines_detail,
        meta: {
          requiresAuth: true,
          title: '工作流详情'
        }
      },
      {
        path: 'profile',
        component: mobile_profile,
        meta: {
          requiresAuth: true,
          title: '用户设置'
        }
      }
    ]
  },
  {
    path: '/signin',
    component: signin,
    meta: {
      title: '登录'
    }
  },
  {
    path: '/404',
    component: not_found,
    meta: {
      title: '404 Not Found'
    }
  },
  {
    path: '/',
    component: signin,
    meta: {
      title: '登录'
    }
  },
  {
    path: '*',
    component: not_found,
    meta: {
      title: '404 Not Found'
    }
  }
]

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: routes
})
