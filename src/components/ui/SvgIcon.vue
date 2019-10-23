<template>
  <div v-html="require(`@/assets/icons/${ icon }.svg`)"></div>
</template>

<script>
  export default {
    props: ['icon']
  }
</script>
