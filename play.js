import { createGenerator, escapeSelector } from './core/index.js'
import presetMini from './preset-mini/index.mjs'
import * as components from '@fabric-ds/css/component-classes'

const uno = createGenerator({
  presets: [
    presetMini({
      // both of these need to be false
      base: false,
      jit: false
    })
  ],
})

const classes = Object.values(components).map(e => {
  if (typeof e === 'object') return Object.values(e).map(e => e.split(/\s/))
  return e.split(/\s/)
}).flat(Infinity)

const result = await uno.generate(classes, { preflights: false })
// const result = await uno.generate(['sm:bg-blue-600', 'sm:p-16'])
console.log(result.css)
