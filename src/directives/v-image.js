/*
const setValue = function(el, binding) {
  const img = new Image();
  img.src = binding.value;

  img.onload = function() {
    this.src = img.src;
    this.classList.add("is-loaded");
  }.bind(el);
};

module.exports = {
  isLiteral: true,
  bind(el, binding) {
    setValue(el, binding);
  },
  update(el, binding) {
    setValue(el, binding);
  }
};
*/
