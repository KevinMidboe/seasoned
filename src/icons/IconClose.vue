<template>
  <svg
    id="icon-cross"
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style="transition-duration: 0s"
    @click="$emit('click')"
    @keydown="event => $emit('keydown', event)"
  >
    <path
      fill="inherit"
      d="M27.942 5.942l-1.883-1.883-10.058 10.054-10.058-10.054-1.883 1.883 10.054 10.058-10.054 10.058 1.883 1.883 10.058-10.054 10.058 10.054 1.883-1.883-10.054-10.058z"
    ></path>
  </svg>
</template>
