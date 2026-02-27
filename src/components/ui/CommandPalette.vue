<template>
  <transition name="fade">
    <div v-if="isOpen" class="command-palette-overlay" @click="close">
      <div class="command-palette" @click.stop>
        <div class="command-palette__search">
          <input
            v-if="!parameterMode"
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Search routes..."
            class="command-palette__input"
            @keydown.down.prevent="selectNext"
            @keydown.up.prevent="selectPrevious"
            @keydown.enter.prevent="navigateToSelected"
            @keydown.esc.prevent="close"
            @keydown="handleInputKeydown"
          />
          <input
            v-else
            ref="parameterInput"
            v-model="parameterValue"
            type="text"
            :placeholder="`Enter ${parameterName}...`"
            class="command-palette__input command-palette__input--parameter"
            @keydown.enter.prevent="confirmParameter"
            @keydown.esc.prevent="cancelParameter"
          />
        </div>
        <div v-if="!parameterMode" class="command-palette__results">
          <div
            v-for="(route, index) in filteredRoutes"
            :key="route.path"
            :class="[
              'command-palette__item',
              { 'command-palette__item--selected': index === selectedIndex }
            ]"
            @click="navigateTo(route)"
            @mouseenter="selectedIndex = index"
          >
            <div class="command-palette__item-left">
              <div class="command-palette__item-icon">
                <component :is="getRouteIcon(route.name)" />
              </div>
              <div class="command-palette__item-content">
                <div class="command-palette__item-title">
                  <span class="command-palette__item-name">{{
                    formatRouteName(route.name)
                  }}</span>
                  <span class="command-palette__item-path">
                    {{ route.path }}
                    <span
                      v-if="routeRequiresInput(route)"
                      class="command-palette__item-param-hint"
                    >
                      (requires {{ getInputParameterName(route) }})
                    </span>
                  </span>
                </div>
                <span class="command-palette__item-description">{{
                  getRouteDescription(route.name)
                }}</span>
              </div>
            </div>
            <div class="command-palette__item-right">
              <span
                v-if="route.meta?.requiresAuth"
                class="command-palette__item-badge command-palette__item-badge--auth"
              >
                🔒 Auth
              </span>
              <span
                v-if="route.meta?.requiresPlexAccount"
                class="command-palette__item-badge command-palette__item-badge--plex"
              >
                Plex
              </span>
              <span v-if="index < 9" class="command-palette__item-shortcut">
                {{ index + 1 }}
              </span>
            </div>
          </div>
          <div
            v-if="filteredRoutes.length === 0 && contentResults.length === 0"
            class="command-palette__empty"
          >
            <span v-if="isSearchingContent">Searching content...</span>
            <span v-else-if="searchDisabled"
              >Search temporarily disabled due to errors</span
            >
            <span v-else>No routes or content found</span>
          </div>
          <div
            v-if="filteredRoutes.length === 0 && contentResults.length > 0"
            class="command-palette__content-results"
          >
            <div class="command-palette__content-header">Movies & Shows</div>
            <div
              v-for="(result, index) in contentResults"
              :key="result.id"
              :class="[
                'command-palette__item',
                { 'command-palette__item--selected': index === selectedIndex }
              ]"
              @click="openContent(result)"
              @mouseenter="selectedIndex = index"
            >
              <div class="command-palette__item-left">
                <div class="command-palette__item-icon">
                  <component
                    :is="result.type === 'movie' ? IconMovie : IconShow"
                  />
                </div>
                <div class="command-palette__item-content">
                  <div class="command-palette__item-title">
                    <span class="command-palette__item-name">{{
                      result.title
                    }}</span>
                  </div>
                  <span class="command-palette__item-description">
                    {{ result.type === "movie" ? "Movie" : "TV Show" }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import type { RouteRecordNormalized } from "vue-router";
  import type { Component } from "vue";
  import IconMovie from "@/icons/IconMovie.vue";
  import IconActivity from "@/icons/IconActivity.vue";
  import IconProfile from "@/icons/IconProfile.vue";
  import IconRequest from "@/icons/IconRequest.vue";
  import IconInbox from "@/icons/IconInbox.vue";
  import IconSearch from "@/icons/IconSearch.vue";
  import IconEdit from "@/icons/IconEdit.vue";
  import IconSettings from "@/icons/IconSettings.vue";
  import IconKey from "@/icons/IconKey.vue";
  import IconMagnet from "@/icons/IconMagnet.vue";
  import IconProfileLock from "@/icons/IconProfileLock.vue";
  import IconShow from "@/icons/IconShow.vue";
  import { elasticSearchMoviesAndShows } from "@/api";
  import type { IAutocompleteResult } from "@/interfaces/IAutocompleteSearch";
  import { trackCommand, getCommandScore } from "@/utils/commandTracking";

  const router = useRouter();
  const store = useStore();
  const isOpen = ref(false);
  const searchQuery = ref("");
  const selectedIndex = ref(0);
  const searchInput = ref<HTMLInputElement | null>(null);
  const parameterInput = ref<HTMLInputElement | null>(null);
  const parameterMode = ref(false);
  const parameterName = ref("");
  const parameterValue = ref("");
  const pendingRoute = ref<RouteRecordNormalized | null>(null);
  const contentResults = ref<IAutocompleteResult[]>([]);
  const isSearchingContent = ref(false);
  const searchDisabled = ref(false);
  const searchErrorCount = ref(0);
  const lastSearchTime = ref(0);
  const SEARCH_COOLDOWN = 500; // ms between searches
  const MAX_ERRORS = 3; // Disable after 3 errors

  const routeMetadata: Record<
    string,
    {
      icon: Component;
      description: string;
      requiresInput?: boolean;
      inputParamName?: string;
    }
  > = {
    home: { icon: IconMovie, description: "Browse movies and TV shows" },
    activity: { icon: IconActivity, description: "View Plex server activity" },
    profile: { icon: IconProfile, description: "Manage your profile" },
    "requests-list": null,
    list: { icon: IconInbox, description: "Browse custom lists" },
    search: {
      icon: IconSearch,
      description: "Search for content",
      requiresInput: true,
      inputParamName: "query"
    },
    register: { icon: IconEdit, description: "Create a new account" },
    settings: { icon: IconSettings, description: "Configure your preferences" },
    signin: { icon: IconKey, description: "Sign in to your account" },
    torrents: { icon: IconMagnet, description: "Manage torrents" },
    "password-gen": {
      icon: IconKey,
      description: "Generate secure passwords"
    },
    admin: { icon: IconProfileLock, description: "Admin dashboard" }
  };

  const routes = computed(() => {
    return router.getRoutes().filter(route => {
      return (
        routeMetadata[route?.name?.toString() ?? ""] &&
        route.name &&
        route.name !== "NotFound"
      );
    });
  });

  const filteredRoutes = computed(() => {
    let filtered: RouteRecordNormalized[];

    if (!searchQuery.value) {
      filtered = routes.value;
    } else {
      const query = searchQuery.value.toLowerCase();
      filtered = routes.value.filter(route => {
        const name = String(route.name).toLowerCase();
        const path = route.path.toLowerCase();
        return name.includes(query) || path.includes(query);
      });
    }

    // Sort by command score (most used + recent first)
    return filtered.sort((a, b) => {
      const scoreA = getCommandScore(String(a.name));
      const scoreB = getCommandScore(String(b.name));
      return scoreB - scoreA;
    });
  });

  function formatRouteName(name: string | symbol | undefined): string {
    if (!name) return "";
    const str = String(name);
    return str
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getRouteIcon(name: string | symbol | undefined): Component {
    if (!name) return IconMovie;
    const routeName = String(name);
    return routeMetadata[routeName]?.icon || IconMovie;
  }

  function getRouteDescription(name: string | symbol | undefined): string {
    if (!name) return "";
    const routeName = String(name);
    return routeMetadata[routeName]?.description || "";
  }

  function open() {
    isOpen.value = true;
    searchQuery.value = "";
    selectedIndex.value = 0;
    // Reset search state when opening
    searchErrorCount.value = 0;
    searchDisabled.value = false;
  }

  function close() {
    isOpen.value = false;
    searchQuery.value = "";
    selectedIndex.value = 0;
    parameterMode.value = false;
    parameterName.value = "";
    parameterValue.value = "";
    pendingRoute.value = null;
  }

  function scrollSelectedIntoView() {
    nextTick(() => {
      const selectedElement = document.querySelector(
        ".command-palette__item--selected"
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      }
    });
  }

  function selectNext() {
    const maxIndex = Math.max(
      filteredRoutes.value.length - 1,
      contentResults.value.length - 1
    );
    if (selectedIndex.value < maxIndex) {
      selectedIndex.value++;
      scrollSelectedIntoView();
    }
  }

  function selectPrevious() {
    if (selectedIndex.value > 0) {
      selectedIndex.value--;
      scrollSelectedIntoView();
    }
  }

  function navigateToSelected() {
    // Check if we have route results
    if (filteredRoutes.value.length > 0) {
      const route = filteredRoutes.value[selectedIndex.value];
      if (route) {
        navigateTo(route);
        return;
      }
    }

    // Check if we have content results
    if (contentResults.value.length > 0) {
      const result = contentResults.value[selectedIndex.value];
      if (result) {
        openContent(result);
        return;
      }
    }
  }

  function hasParameter(path: string): boolean {
    return path.includes(":");
  }

  function extractParameterName(path: string): string {
    const match = path.match(/:([^/]+)/);
    return match ? match[1] : "";
  }

  function routeRequiresInput(route: RouteRecordNormalized): boolean {
    const routeName = String(route.name);
    return routeMetadata[routeName]?.requiresInput || hasParameter(route.path);
  }

  function getInputParameterName(route: RouteRecordNormalized): string {
    const routeName = String(route.name);
    if (routeMetadata[routeName]?.inputParamName) {
      return routeMetadata[routeName].inputParamName!;
    }
    return extractParameterName(route.path);
  }

  function navigateTo(route: RouteRecordNormalized) {
    if (routeRequiresInput(route)) {
      // Enter parameter mode
      parameterMode.value = true;
      parameterName.value = getInputParameterName(route);
      parameterValue.value = "";
      pendingRoute.value = route;
      setTimeout(() => {
        parameterInput.value?.focus();
      }, 50);
    } else {
      // Track the command usage
      trackCommand(String(route.name), "route", { routePath: route.path });
      router.push(route.path);
      close();
    }
  }

  function confirmParameter() {
    if (!pendingRoute.value || !parameterValue.value.trim()) return;

    const routeName = String(pendingRoute.value.name);
    const metadata = routeMetadata[routeName];

    // Track the command usage
    trackCommand(routeName, "route", { routePath: pendingRoute.value.path });

    // Check if this route uses query parameters instead of path parameters
    if (metadata?.inputParamName) {
      router.push({
        path: pendingRoute.value.path,
        query: { [metadata.inputParamName]: parameterValue.value.trim() }
      });
    } else {
      // Traditional path parameter replacement
      const path = pendingRoute.value.path.replace(
        /:([^/]+)/,
        parameterValue.value.trim()
      );
      router.push(path);
    }
    close();
  }

  function cancelParameter() {
    parameterMode.value = false;
    parameterName.value = "";
    parameterValue.value = "";
    pendingRoute.value = null;
    setTimeout(() => {
      searchInput.value?.focus();
    }, 50);
  }

  async function searchContent() {
    // Prevent searching if already searching, disabled, or on cooldown
    if (isSearchingContent.value || searchDisabled.value) return;

    const now = Date.now();
    if (now - lastSearchTime.value < SEARCH_COOLDOWN) return;
    lastSearchTime.value = now;

    const ELASTIC_URL = import.meta.env.VITE_ELASTIC_URL;
    const ELASTIC_API_KEY = import.meta.env.VITE_ELASTIC_API_KEY;

    // Don't search if elastic is not configured
    if (!ELASTIC_URL || !ELASTIC_API_KEY) {
      contentResults.value = [];
      return;
    }

    isSearchingContent.value = true;
    try {
      const response = await elasticSearchMoviesAndShows(searchQuery.value, 10);
      const results: IAutocompleteResult[] = response.hits.hits.map(
        (item: any) => ({
          title: item._source?.original_name || item._source.original_title,
          id: item._source.id,
          type: item._source.type === "movie" ? "movie" : "show"
        })
      );

      // Sort content results by command score (most used + recent first)
      const sortedResults = results.sort((a, b) => {
        const scoreA = getCommandScore(`${a.type}:${a.id}`);
        const scoreB = getCommandScore(`${b.type}:${b.id}`);
        return scoreB - scoreA;
      });

      contentResults.value = sortedResults;
      // Reset error count on success
      searchErrorCount.value = 0;
    } catch (error) {
      console.error("Search failed:", error);
      contentResults.value = [];

      // Increment error count and disable if threshold reached
      searchErrorCount.value++;
      if (searchErrorCount.value >= MAX_ERRORS) {
        searchDisabled.value = true;
        console.warn(
          `Content search disabled after ${MAX_ERRORS} consecutive errors`
        );
      }
    } finally {
      isSearchingContent.value = false;
    }
  }

  function openContent(result: IAutocompleteResult) {
    // Track content opening with unique ID
    const contentId = `${result.type}:${result.id}`;
    trackCommand(contentId, "content");

    store.dispatch("popup/open", {
      id: result.id,
      type: result.type
    });
    close();
  }

  function handleInputKeydown(event: KeyboardEvent) {
    // Check for number keys 1-9 to select routes or content
    const num = parseInt(event.key);
    if (!isNaN(num) && num >= 1 && num <= 9) {
      const index = num - 1;

      // Try routes first
      if (index < filteredRoutes.value.length) {
        event.preventDefault();
        navigateTo(filteredRoutes.value[index]);
        return;
      }

      // Try content results
      if (index < contentResults.value.length) {
        event.preventDefault();
        openContent(contentResults.value[index]);
        return;
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      if (isOpen.value) {
        close();
      } else {
        open();
      }
    }

    if (event.key === "Escape" && isOpen.value) {
      event.preventDefault();
      close();
    }
  }

  watch(isOpen, newValue => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        searchInput.value?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }
  });

  let searchTimeout: NodeJS.Timeout | null = null;

  watch(searchQuery, () => {
    selectedIndex.value = 0;
    // Don't clear content results immediately - let debounce handle it
  });

  // Trigger content search when no routes match (with debouncing)
  watch(filteredRoutes, newRoutes => {
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (newRoutes.length === 0 && searchQuery.value.length > 0) {
      // Debounce search to avoid clearing results while typing fast
      searchTimeout = setTimeout(() => {
        searchContent();
      }, 300);
    } else if (newRoutes.length > 0) {
      // Clear content results when routes are found
      contentResults.value = [];
    }
  });

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });

  defineExpose({
    open,
    close
  });
</script>

<style lang="scss" scoped>
  @import "scss/variables.scss";
  @import "scss/media-queries.scss";

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .command-palette-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 9999;
    padding-top: 15vh;

    @include mobile {
      padding-top: 10vh;
    }
  }

  .command-palette {
    background: var(--background-color-secondary);
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 640px;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @include mobile {
      width: 95%;
      max-height: 70vh;
    }
  }

  .command-palette__search {
    padding: 1rem;
    border-bottom: 1px solid var(--text-color-10);
  }

  .command-palette__input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1.1rem;
    border: none;
    background: var(--background-ui);
    color: var(--text-color);
    border-radius: 8px;
    outline: none;
    font-family: inherit;

    &::placeholder {
      color: var(--text-color-50);
    }

    &--parameter {
      background: var(--color-success);
      color: var(--color-success-text);
      font-weight: 500;

      &::placeholder {
        color: var(--color-success-text);
        opacity: 0.8;
      }
    }

    @include mobile {
      font-size: 1rem;
      padding: 0.625rem 0.875rem;
    }
  }

  .command-palette__results {
    overflow-y: auto;
    max-height: 50vh;
    padding: 0.5rem;

    @include mobile {
      max-height: 60vh;
    }
  }

  .command-palette__item {
    padding: 1rem;
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: background-color 0.15s ease;
    gap: 1rem;

    &:hover,
    &--selected {
      background: var(--background-ui);
    }

    @include mobile {
      padding: 0.875rem;
      gap: 0.75rem;
    }
  }

  .command-palette__item-left {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;

    @include mobile {
      gap: 0.625rem;
    }
  }

  .command-palette__item-icon {
    width: 1.5rem;
    height: 1.5rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-70);

    svg {
      width: 100%;
      height: 100%;
      fill: currentColor;
    }

    @include mobile {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .command-palette__item-content {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    flex: 1;
    min-width: 0;
  }

  .command-palette__item-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .command-palette__item-name {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);

    @include mobile {
      font-size: 0.95rem;
    }
  }

  .command-palette__item-path {
    font-size: 0.8rem;
    color: var(--text-color-50);
    font-weight: 400;

    @include mobile {
      font-size: 0.75rem;
    }
  }

  .command-palette__item-param-hint {
    font-size: 0.75rem;
    color: var(--text-color-70);
    font-style: italic;
    margin-left: 0.25rem;

    @include mobile {
      font-size: 0.7rem;
    }
  }

  .command-palette__item-description {
    font-size: 0.875rem;
    color: var(--text-color-70);
    line-height: 1.4;

    @include mobile {
      font-size: 0.8rem;
    }
  }

  .command-palette__item-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;

    @include mobile {
      gap: 0.375rem;
    }
  }

  .command-palette__item-badge {
    font-size: 0.7rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    font-weight: 500;

    &--auth {
      background: var(--color-warning);
      color: var(--text-color);
    }

    &--plex {
      background: var(--color-success);
      color: var(--color-success-text);
    }

    @include mobile {
      font-size: 0.65rem;
      padding: 0.2rem 0.4rem;
    }
  }

  .command-palette__item-shortcut {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: var(--background-ui);
    color: var(--text-color-70);
    border: 1px solid var(--text-color-10);
    border-radius: 4px;
    font-weight: 600;
    min-width: 1.5rem;
    text-align: center;

    @include mobile {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      min-width: 1.25rem;
    }
  }

  .command-palette__empty {
    padding: 2rem;
    text-align: center;
    color: var(--text-color-50);
    font-size: 0.95rem;
  }

  .command-palette__content-results {
    padding: 0.5rem;
  }

  .command-palette__content-header {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-color-50);
    padding: 0.5rem 1rem;
    margin-bottom: 0.25rem;
  }
</style>
