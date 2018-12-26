<template>
  <div>
    <component :is="dialogRouter"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminAdd from './admin/add'
import adminEdit from './admin/edit'

export default {
  name: 'add1',
  components: { adminAdd,adminEdit },
  props: {
    dialogRouter:{
      type: String,
      default: 'adminAdd'
    }
  },
  data() {
    return {
      dialogRouter: this.dialogRouter
    }
  },
  watch: {
    dialogRouter:{
      immediate: true,    // 这句重要
      handler (val) {
          this.dialogRouter = val;
      }
    }
  },
  methods:{

  }
}
</script>
