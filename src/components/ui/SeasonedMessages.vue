<template>
  <transition-group name="fade">
    <div class="message" v-for="message in messages" :class="message.type || 'warning'" :key="message">
      <span class="pinstripe"></span>
      <div>
        <h2>{{ message.title || defaultTitles[message.type] }}</h2>
        <span>{{ message.message }}</span>
      </div>

      <button class="dismiss" @click="clicked(message)">X</button>
    </div>
  </transition-group>
</template>

<script>

export default {
  props: {
    messages: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      defaultTitles: {
        error: 'Unexpected error',
        warning: 'Something went wrong',
        undefined: 'Something went wrong'
      },
      localMessages: [...this.messages]
    }
  },
  methods: {
    clicked(e) {
      const removedMessage = [...this.messages].filter(mes => mes !== e)
      this.$emit('update:messages', removedMessage)
    }
  },
  // watch: {
  //   messages(propState, oldState) {
  //     const newMessage = propState.filter(msg => !this.localMessages.includes(msg))
  //     console.log('newMessage', newMessage)
  //     this.localMessages = this.localMessages.concat(newMessage)
  //   }
  // }
}

</script>

<style lang="scss" scoped>
@import "./src/scss/variables";
.fade-enter-active {
  transition: opacity .4s;
}
.fade-leave-active {
  transition: opacitiy .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.message {
  width: 100%;
  max-width: 35rem;
  height: 80px;

  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  // padding-bottom: 1rem;
  // background-color: red;

  &:first-of-type {
    background-color: navajowhite;
  }
  

  > div {
    margin: 8px 24px;
    width: 100%;

  }

  h2 {
    font-weight: 300;
    margin: 0;
  }
  span {
    font-weight: 300;
  }

  .pinstripe {
    height: 100%;
    width: 0.5rem;
    // background-color: $color-error-highlight;
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
    transition: color .5s ease;
    color: $white-80;

    &:hover {
      color: $white;
    }
  }

  &.success {
    color: $color-error-text;
    background-color: $color-success;

    .pinstripe {
      background-color: $color-success-highlight;
    }
  }
  
  &.error {
    color: $color-error-text;
    background-color: $color-error;

    .pinstripe {
      background-color: $color-error-highlight;
    }
  }

  &.warning {
    color: $black;
    background-color: $color-warning;

    .dismiss {
      color: $black-80;

      &:hover {
        color: $black;
      }
    }
    
    .pinstripe {
      background-color: $color-warning-light;
    }
  }
}

</style>