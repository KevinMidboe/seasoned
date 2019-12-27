<template>
  <transition-group name="fade">
    <div class="message" v-for="(message, index) in reversedMessages" :class="message.type || 'warning'" :key="index">
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
  computed: {
    reversedMessages() {
      return [...this.messages].reverse()
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
@import "./src/scss/media-queries";

.fade-enter-active {
  transition: opacity .4s;
}
.fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.message {
  width: 100%;
  max-width: 35rem;
  min-height: 75px;

  display: flex;
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: $text-color-70;

  > div {
    margin: 6px 24px;
    width: 100%;

  }

  h2 {
    font-weight: 300;
    letter-spacing: 0.25px;
    margin: 0;
    font-size: 1.3rem;
    color: $text-color;
    transition: color .5s ease;
  }
  span {
    font-weight: 300;
    color: $text-color-70;
    transition: color .5s ease;
  }

  @include mobile-only {
    > div {
      margin: 6px 6px;
      line-height: 1.3rem;
    }
    h2 {
      font-size: 1.1rem;
    }
    span {
      font-size: 0.9rem;
    }

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
    color: $text-color-70;
    transition: color .5s ease;

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