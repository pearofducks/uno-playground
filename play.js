import { createGenerator, escapeSelector } from './core/index.js'
import presetMini from './preset-mini/index.mjs'

const uno = createGenerator({
  blocklist: [
    'p-16'
  ],
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

const result = await uno.generate(['p-16', 'p-8', 'dark:bg-white', 'text-a-b-d', 'text-a-b-c', 'text-a-camel-case'], { preflights: false })
console.log(result, result.css)
