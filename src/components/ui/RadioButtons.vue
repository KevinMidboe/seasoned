<template>
  <div>
    <label v-for="option in options" class="radio" @click="selected = option.value">
      <input type="radio" v-model="selected" :value="option.value" />
      <label>{{ option.text }}</label>


      <div class="sub-radios" v-if="option.subElements && selected === option.value">
        <label class="radio" v-for="elem in option.subElements">
          <input type="radio" v-model="selectedSubItem" :value="option.value + '-' + elem.value" />
          <label>{{ elem.text }}</label>
        </label>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    value: {
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      selected: this.value || this.options[0].value,
      selectedSubItem: null
    };
  },
  beforeMount() {
    this.handleChange()
  },
  watch: {
    selected() {
      this.handleChange();
    }
  },
  methods: {
    handleChange() {
      if (this.value !== undefined) {
        this.$emit("update:value", this.selected);
      } else {
        this.$emit("changed", this.selected);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./src/scss/variables.scss";

$radioSize: 16px;
$ui-border-width: 2px;

.sub-radios {
  display: flex;
  flex-direction: column;
  flex: 0 0 100%;
  margin-left: 1rem;
  
  &:first-of-type {
    margin-top: 1rem;
  }
}

.radio {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 14px;
  width: max-content;

  input[type="radio"] {
    display: block;
    opacity: 0;

    + label {
      position: relative;
      display: inline-block;
      cursor: pointer;
      padding-left: 1.25rem;
      font-weight: 300;

      &::before {
        content: "";
        display: inline-block;
        position: absolute;
        left: -($radioSize / 4) * 4;
        border-radius: 50%;
        border: $ui-border-width solid $text-color-70;
        width: $radioSize;
        height: $radioSize;
      }

      &::after {
        content: "";
        position: absolute;
        display: inline-block;
        left: -($radioSize / 4) * 3;
        top: $radioSize / 4;
        border-radius: 50%;
        width: ($radioSize / 4) * 3;
        height: ($radioSize / 4) * 3;
      }
    }

    &:checked,
    &:hover {
      + label::after {
        background-color: $green;
      }
      + label::before {
        border-color: $text-color;
      }
    }

    &:focus {
      + label::before {
        outline: $ui-border-width solid Highlight;
        outline-style: auto;
        outline-color: -webkit-focus-ring-color;
      }
    }
  }
}
</style>
