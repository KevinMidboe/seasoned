<template>
  <div class="group" :class="{ completed: value.length > 0 }">
    <svg class="group__input-icon"><use v-bind="{'xlink:href':'#icon' + icon}"></use></svg>
    <input class="group__input" :type="tempType || type" ref="plex_username" 
            v-model="value" :placeholder="text" @keyup.enter="submit" @input="handleInput" />
    
    <i v-if="value.length > 0 && type === 'password'" @click="toggleShowPassword" class="group__input-show noselect">show</i>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String },
    icon: { type: String },
    type: { type: String }
  },
  data() {
    return { value: '', tempType: undefined }
  },
  methods: {
    submit(event) {
      this.$emit('enter')
    },
    handleInput(value) {
      console.log('this.value', this.value)
      this.$emit('inputValue', this.value)
    },
    toggleShowPassword() {
      if (this.tempType === 'text') {
        this.tempType = 'password'
      } else {
        this.tempType = 'text'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./src/scss/variables";
@import "./src/scss/media-queries";

.group{
  display: flex;
  margin-bottom: 1rem;
  width: 100%;

  &:hover, &:focus {
    .group__input {
      border-color: $c-dark;

      &-icon {
        fill: $c-dark;
      }      
    }
  }

  &.completed {
    .group__input {
      border-color: $c-dark;

      &-icon {
        fill: $c-dark;
      }      
    }
  }

  &__input {
    width: 100%;
    max-width: 35rem;
    padding: 10px 10px 10px 45px;
    // padding: 15px 10px 15px 45px;
    outline: none;
    background-color: $c-white;
    color: $c-dark;
    font-weight: 100;
    font-size: 1.2rem;
    border: 1px solid rgba($c-dark, 0.5);
    margin-left: -2.2rem;
    // margin-bottom: 1rem;
    z-index: 3;
    transition: border-color .5s ease;

    &-show {
      position: relative;
      left: -50px;
      z-index: 11;
      margin: auto 0;
      height: 100%;
      font-size: 0.9rem;
      cursor: pointer;
      color: rgba($c-dark, 0.5);
    }
  }

  &__input-icon {
    width: 24px;
    height: 24px;
    fill: rgba($c-dark, 0.5);
    transition: fill 0.5s ease;
    pointer-events: none;
    margin-top: 10px;
    margin-left: 10px;
    z-index: 8;
  }
}
</style>