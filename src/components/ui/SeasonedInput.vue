<template>
  <div class="group" :class="{ completed: modelValue, focus }">
    <component :is="inputIcon" v-if="inputIcon" />

    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      class="input"
      :type="toggledType || type || 'text'"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @keyup.enter="event => emit('enter', event)"
      @focus="focus = true"
      @blur="focus = false"
    />

    <i
      v-if="modelValue && type === 'password'"
      class="show noselect"
      tabindex="0"
      @click="toggleShowPassword"
      @keydown.enter="toggleShowPassword"
      >{{ toggledType == "password" ? "show" : "hide" }}</i
    >
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from "vue";
  import IconKey from "@/icons/IconKey.vue";
  import IconEmail from "@/icons/IconEmail.vue";
  import IconBinoculars from "@/icons/IconBinoculars.vue";
  import type { Ref } from "vue";

  interface Props {
    modelValue: string;
    placeholder: string;
    type?: string;
  }

  interface Emit {
    (e: "change");
    (e: "enter", event?: KeyboardEvent);
    (e: "update:modelValue", value: string);
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emit>();

  const toggledType: Ref<string> = ref(props.type);
  const focus: Ref<boolean> = ref(false);

  const inputIcon = computed(() => {
    if (props.type === "password") return IconKey;
    if (props.type === "email") return IconEmail;
    if (props.type === "torrents") return IconBinoculars;
    return false;
  });

  function handleInput(event: KeyboardEvent) {
    const target = event?.target as HTMLInputElement;
    if (!target) return;

    emit("update:modelValue", target?.value);
  }

  // Could we move this to component that injects ??
  function toggleShowPassword() {
    if (toggledType.value === "text") {
      toggledType.value = "password";
    } else {
      toggledType.value = "text";
    }
  }
</script>
<style lang="scss" scoped>
  @import "src/scss/variables";
  @import "src/scss/media-queries";

  .group {
    display: flex;
    width: 100%;
    position: relative;
    max-width: 35rem;
    border: 1px solid var(--text-color-50);
    background-color: var(--background-color-secondary);

    &.completed,
    &.focus,
    &:hover,
    &:focus {
      border-color: var(--text-color);

      svg {
        fill: var(--text-color);
      }
    }

    svg {
      width: 24px;
      height: 24px;
      fill: var(--text-color-50);
      pointer-events: none;
      margin-top: 10px;
      margin-left: 10px;
      z-index: 8;
    }

    input {
      width: 100%;
      padding: 10px;
      outline: none;
      background-color: var(--background-color-secondary);
      color: var(--text-color);
      font-weight: 100;
      font-size: 1.2rem;
      margin: 0;
      z-index: 3;
      border: none;

      border-radius: 0;
      -webkit-appearance: none;
    }

    .show {
      position: absolute;
      display: grid;
      place-items: center;
      right: 20px;
      z-index: 11;
      margin: auto 0;
      height: 100%;
      font-size: 0.9rem;
      cursor: pointer;
      color: var(--text-color-50);
      -webkit-user-select: none;
      user-select: none;
    }
  }
</style>
