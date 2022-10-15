import { createGenerator, escapeSelector } from './core/index.js'
import presetMini from './preset-mini/index.mjs'

const uno = createGenerator({
  presets: [
    presetMini({ dark: 'media', variablePrefix: 'f-' })
  ],
  theme: {
    colors: {
      a: {
        b: {
          c: '#512345',
          d: 'var(--f-blue-100)',
        },
        camelCase: '#234'
      }
    }
  }
})

const { css } = await uno.generate(['dark:bg-white', 'text-a-b-d', 'text-a-b-c', 'text-a-camel-case'], { preflights: false })
console.log(css)
