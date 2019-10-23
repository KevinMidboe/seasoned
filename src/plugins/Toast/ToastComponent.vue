<template>
  <transition name="slide">
      <div
          v-if="show"
          @click="clicked"
          class="toast"
          :class="type">

          <div class="toast--content">
              <div class=" toast--icon">
                  <i v-if="image"><img class="toast--icon-image" :src="image" /></i>
              </div>
              <div class="toast--text" v-if="description">
                <span class="toast--text__title">{{title}}</span>
                <br /><span class="toast--text__description" v-html="description"></span>
              </div>
              <div class="toast--text" v-else>
                <span class="toast--text__title-large">{{title}}</span>
              </div>
              <div class="toast--dismiss" @click="dismiss">
                  <i class="fas fa-times"></i>
              </div>
          </div>
      </div>
  </transition>

</template>

<script>
export default {
  data() {
    return {
      type: this.$root.type || 'info',
      title: this.$root.title || undefined,
      description: this.$root.description || undefined,
      image: this.$root.image || undefined,
      link: this.$root.link || undefined,
      timeout: this.$root.timeout || 2000,
      show: false
    }
  },
  mounted() {
    // Here we set show when mounted in-order to get the transition animation to be displayed correctly
    this.show = true;

    setTimeout(() => {
      console.log('Your time is up 👋')
      this.show = false;
    }, this.timeout);
  },
  methods: {
    clicked() {      
      if (this.link) {
        let resolved = this.$root.router.resolve(this.link);
        
        if (resolved && resolved.route.name !== '404') {
          this.$root.router.push(this.link);
        } else {
          console.error('Found a link but it resolved to 404. Link:', this.link)
        }
      } else {
        this.show = false;
      }
    },
    dismiss() {
      this.show = false;
    },
    move(e) {
      console.log('moving', e)
      let target = e.target;

      console.log('target', target)

      var div = document.getElementById('target');
      div.style.position = 'absolute';
      div.style.top = e.clientY + 'px';
      div.style.left = e.clientX + 'px';
    },
  }
};
</script>

<style lang="scss" scoped>
// @import '@/scss/variables.scss';


.slide-enter-active {
  transition: all 0.3s ease;
}
.slide-enter, .slide-leave-to {
  transform: translateY(100vh);
  opacity: 0;
}
.slide-leave-active {
  transition: all 2s ease;
}

.toast--icon-image {
  height: 100%;
  width: 100%;
  max-height: 45px;
  max-width: 45px;
}

.toast {
  position: fixed;
  bottom: 0.5rem;
  cursor: pointer;
  z-index: 100;

  background-color: white;
  border-radius: 3px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.17), 0 2px 4px 0 rgba(0,0,0,0.08);
  padding: 0.5rem;
  margin: 1rem 2rem 1rem 0.71rem;
  // max-width: calc(100% - 3rem);
  min-width: 320px;


  // If small screen we have a min-width that is related to the screen size.
  // else large screens we want a max-width that only uses the space in bottom right

  right: 0;
  line-height: 22.5px;
  
  &--content {
    display: flex;
    align-items: center;

  }

  &--icon {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  &--text {
    margin-left: 0.5rem;
    // color: $bt-brown;
    color: black;
    word-wrap: break-word;

    &__title {
      text-transform: capitalize;
      font-weight: 400;

      &-large {
        font-size: 2rem;
      }
    }

    &__description {
      font-weight: 300;
    }
  }

  &--dismiss {
    align-self: flex-end;

    img {
      width: 2.5rem;
    }
  }


  &.success {
    border-left: 6px solid #38c172;
  }

  &.info {
    border-left: 6px solid #FFD300;
  }

  &.warning {
    border-left: 6px solid #f6993f;
  }

  &.error {
    border-left: 6px solid #e3342f;
  }

  &.simple {
    border-left: unset;
  }

} 
</style>