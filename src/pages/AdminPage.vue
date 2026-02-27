<template>
  <section class="admin">
    <h1 class="admin__title">Admin Dashboard</h1>

    <div class="admin__grid">
      <AdminStats class="admin__stats" />
      <SystemStatusPanel class="admin__system-status" />
    </div>

    <div class="admin__torrents">
      <TorrentManagementGrid />
    </div>

    <div class="admin__activity">
      <RecentActivityFeed />
    </div>
  </section>
</template>

<script setup lang="ts">
  import AdminStats from "@/components/admin/AdminStats.vue";
  import TorrentManagementGrid from "@/components/admin/TorrentManagementGrid.vue";
  import SystemStatusPanel from "@/components/admin/SystemStatusPanel.vue";
  import RecentActivityFeed from "@/components/admin/RecentActivityFeed.vue";
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .admin {
    padding: 3rem;

    @include mobile-only {
      padding: 1rem;
    }

    &__title {
      margin: 0 0 2rem 0;
      font-size: 2rem;
      font-weight: 300;
      color: $text-color;
    }

    &__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1.5rem;

      @include mobile-only {
        grid-template-columns: 1fr;
      }
    }

    &__stats {
      grid-column: 1;
    }

    &__system-status {
      grid-column: 2;

      @include mobile-only {
        grid-column: 1;
      }
    }

    &__torrents {
      margin-bottom: 1.5rem;
    }

    &__activity {
      margin-bottom: 1.5rem;
    }
  }
</style>
