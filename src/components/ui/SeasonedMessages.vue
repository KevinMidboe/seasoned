<template>
  <transition-group name="fade">
    <div
      v-for="(message, index) in messages"
      :key="generateMessageKey(index, message)"
      class="card"
      :class="message.type || 'warning'"
    >
      <span class="pinstripe"></span>
      <div class="content">
        <h2 class="title">
          {{ message.title || titleFromType(message.type) }}
        </h2>
        <span v-if="message.message" class="message">{{
          message.message
        }}</span>
      </div>

      <button class="dismiss" @click="dismiss(Number(index))">X</button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits } from "vue";
  import type {
    ErrorMessageTypes,
    IErrorMessage
  } from "../../interfaces/IErrorMessage";

  interface Props {
    messages: IErrorMessage[];
  }

  interface Emit {
    (e: "update:messages", messages: IErrorMessage[]);
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emit>();

  const defaultTitles = {
    error: "Unexpected error",
    warning: "Something went wrong",
    success: "Success!",
    undefined: "Something went wrong"
  };

  function titleFromType(type: ErrorMessageTypes) {
    return defaultTitles[type];
  }

  function dismiss(index: number) {
    const _messages = [...props.messages];
    _messages.splice(index, 1);
    emit("update:messages", _messages);
  }

  function generateMessageKey(
    index: string | number | symbol,
    errorMessage: IErrorMessage
  ) {
    return `${String(index)}-${errorMessage.title}-${errorMessage.type}`;
  }
</script>

<style lang="scss" scoped>
  @import "scss/variables";
  @import "scss/media-queries";

  .fade-active {
    transition: opacity 0.4s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .card {
    width: 100%;
    max-width: 35rem;

    display: flex;
    margin-top: 0.8rem;
    color: $text-color-70;

    .content {
      margin: 0.4rem 1.2rem;
      width: 100%;

      .title {
        font-weight: 300;
        letter-spacing: 0.25px;
        margin: 0;
        font-size: 1.3rem;
        color: $text-color;
        transition: color 0.5s ease;
      }

      .message {
        font-weight: 400;
        font-size: 1.2rem;
        color: $text-color-70;
        transition: color 0.5s ease;
        margin-bottom: 0.2rem;
      }

      @include mobile-only {
        margin: 6px 6px;
        line-height: 1.3rem;

        h2 {
          font-size: 1.1rem;
        }
        span {
          font-size: 0.9rem;
        }
      }
    }

    .pinstripe {
      width: 0.5rem;
      background-color: $color-error-highlight;
    }

    .dismiss {
      position: relative;
      -webkit-appearance: none;
      -moz-appearance: none;
      background-color: transparent;
      border: unset;
      font-size: 18px;
      cursor: pointer;

      top: 0;
      float: right;
      height: 1.5rem;
      width: 1.5rem;
      padding: 0;
      margin-top: 0.5rem;
      margin-right: 0.5rem;
      color: $text-color-70;
      transition: color 0.5s ease;

      &:hover {
        color: $text-color;
      }
    }

    &.success {
      background-color: $color-success;

      .pinstripe {
        background-color: $color-success-highlight;
      }
    }

    &.error {
      background-color: $color-error;

      .pinstripe {
        background-color: $color-error-highlight;
      }
    }

    &.warning {
      background-color: $color-warning;

      .pinstripe {
        background-color: $color-warning-highlight;
      }
    }
  }
</style>
