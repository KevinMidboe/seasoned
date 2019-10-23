import Vue from 'vue'
import ToastComponent from './ToastComponent.vue'

const optionsDefaults = {
  data: {
    type: 'info',
    show: true,
    timeout: 3000,

    onCreate(created = null) {
    },
    onEdit(editted = null) {
    },
    onRemove(removed = null) {
    }
  }
}

function toast(options, router) {
  // merge the default options with the passed options.
  const root = new Vue({
    data: {
      ...optionsDefaults.data,
      ...options,
      router
    },
    render: createElement => createElement(ToastComponent)
  })

  root.$mount(document.body.appendChild(document.createElement('div')))
}


export default {
  install(vue, opts) {
    console.log('installing toast plugin!')
    console.log('plugin options', opts)

    Vue.prototype.$notifications = {
        info(options) {
          toast({ type: 'info', ...options })
        },
        success(options) {
          toast({ type: 'success', ...options })
        },
        warning(options) {
          toast({ type: 'warning', ...options })
        },
        error(options) {
          toast({ type: 'error', ...options })
        },
        simple(options) {
          toast({ type: 'simple', ...options})
        }
    }
  }
}