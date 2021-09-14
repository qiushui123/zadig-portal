<template>
  <ServiceBuild :envName="$route.query.envName"/>
</template>
<script>
import ServiceBuild from '@/components/projects/common/hosting/serviceBuild'

export default {
  name: 'service_Build',
  components: {
    ServiceBuild
  },
  onboardingStatus: 2
}
</script>
