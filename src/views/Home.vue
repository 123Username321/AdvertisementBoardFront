<template>
  <div class="home">
    <Start msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Start from '@/components/Start.vue'

export default {
  name: 'Home',
  components: {
    Start
  }
}
</script>
