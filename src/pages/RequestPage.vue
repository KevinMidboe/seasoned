<template>
  <ResultsSection title="Requests" :apiFunction="getRequests" />
</template>

<script setup lang="ts">
  import ResultsSection from "@/components/ResultsSection.vue";
  import { getRequests } from "../api";
</script>

<style lang="scss" scoped>
  .fullwidth-button {
    width: 100%;
    margin: 1rem 0;
    padding-bottom: 2rem;
    display: flex;
    justify-content: center;
  }
</style>
