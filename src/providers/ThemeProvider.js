export default {
  name: 'ThemeProvider',
  props: {
    styledTheme: Object
  },
  provide () {
    return {
      $theme: () => this.styledTheme
    }
  },
  render: function (createElement) {
    return createElement('div', {}, this.$slots.default)
  }
}

