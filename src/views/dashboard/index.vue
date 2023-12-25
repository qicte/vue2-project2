<template>
  <div class="dashboard-container">
    <Card />
    <Sale />
    <Bottom />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Card from './card'
import Sale from './sale'
import Bottom from './bottom'
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  components: {
    Card,
    Sale,
    Bottom
  },
  mounted() {
    this.$store.dispatch('home/getData')
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
