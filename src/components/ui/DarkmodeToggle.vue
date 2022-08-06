<template>
  <div class="darkToggle">
    <span @click="toggleDarkmode">{{ darkmodeToggleIcon }}</span>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";

  let darkmode = ref(systemDarkModeEnabled());
  const darkmodeToggleIcon = computed(() => {
    return darkmode.value ? "🌝" : "🌚";
  });

  function toggleDarkmode() {
    darkmode.value = !darkmode.value;
    document.body.className = darkmode.value ? "dark" : "light";
  }

  function systemDarkModeEnabled() {
    const computedStyle = window.getComputedStyle(document.body);
    if (computedStyle["colorScheme"] != null) {
      return computedStyle.colorScheme.includes("dark");
    }
    return false;
  }
</script>

<style lang="scss" scoped>
  .darkToggle {
    height: 25px;
    width: 25px;
    cursor: pointer;
    position: fixed;
    margin-bottom: 1.5rem;
    margin-right: 2px;
    bottom: 0;
    right: 0;
    z-index: 10;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>
