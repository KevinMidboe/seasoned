<template>
  <svg
    id="icon-database"
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
    <path
      d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    />
  </svg>
</template>
