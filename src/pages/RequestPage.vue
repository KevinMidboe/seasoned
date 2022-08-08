<template>
  <ResultsSection title="Requests" :apiFunction="getRequests" />
</template>

<script>
import ResultsSection from "@/components/ResultsSection";
import { getRequests } from "@/api";

export default {
  components: { ResultsSection },
  methods: {
    getRequests: getRequests
  }
};
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
