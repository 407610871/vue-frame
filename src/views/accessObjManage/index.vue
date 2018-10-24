<template>
  <component :is="currentRole"/>
</template>

<script>
import { mapGetters } from 'vuex'
import admin from './admin'

export default {
  name: 'Dashboard',
  components: { admin },
  data() {
    return {
      currentRole: 'admin'
    }
  }
}
</script>
