<template>
  <svg
    id="icon-timer"
    viewBox="0 0 24 24"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style="transition-duration: 0s"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    @click="$emit('click')"
    @keydown="event => $emit('keydown', event)"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
</template>
