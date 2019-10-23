<template>

  <div class="darkToggle">
    <span @click="toggleDarkmode()">{{ darkmodeToggleIcon }}</span>
  </div>

</template>

<script>
export default {

  data() {
    return {
      darkmode: window.getComputedStyle(document.body).colorScheme.includes('dark')
    }
  },
  methods: {
    toggleDarkmode() {
      this.darkmode = !this.darkmode;
      document.body.className = this.darkmode ? 'dark' : 'light'
    }
  },
  computed: {
    darkmodeToggleIcon() {
      return this.darkmode ? '🌝' : '🌚'
    }
  }
}

</script>


<style lang="scss" scoped>
.darkToggle {
  height: 25px;
  width: 25px;
  cursor: pointer;
  // background-color: red;
  position: fixed;
  margin-bottom: 10px;
  margin-right: 2px;
  bottom: 0;
  right: 0;
  z-index: 1;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>