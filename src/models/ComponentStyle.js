
import hashStr from 'glamor/lib/hash'
import flatten from '../utils/flatten'
import styleSheet from './StyleSheet'
import stylis from 'stylis'

export default (nameGenerator) => {
  const inserted = {}

  class ComponentStyle {
    constructor (rules, clsName) {
      this.rules = rules
      this.clsName = clsName
      stylis.set({ keyframe: false })
      if (!styleSheet.injected) styleSheet.inject()
      this.insertedRule = styleSheet.insert('')
    }

    /*
     * Flattens a rule set into valid CSS
     * Hashes it, wraps the whole chunk in a ._hashName {}
     * Parses that with PostCSS then runs PostCSS-Nested on it
     * Returns the hash to be injected on render()
     * */
    generateAndInjectStyles (executionContext) {
      const flatCSS = flatten(this.rules, executionContext).join('')
        .replace(/^\s*\/\/.*$/gm, '') // replace JS comments
      const hash = hashStr(flatCSS)
      if (!inserted[hash]) {
        const selector = this.clsName ? this.clsName : nameGenerator(hash)
        inserted[hash] = selector
        const css = stylis(`.${selector}`, flatCSS)
        this.insertedRule.appendRule(css)
      }
      return inserted[hash]
    }
  }

  return ComponentStyle
}
