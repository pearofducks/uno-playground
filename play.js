import { createGenerator, escapeSelector } from './core/index.js'
import presetMini from './preset-mini/index.mjs'

const uno = createGenerator({
  presets: [
    presetMini({ jit: true })
  ],
})

// const result = await uno.generate('', { preflights: false })
const result = await uno.generate(['sm:bg-blue-600', 'sm:p-16', 'some-fantastic-llama'])
console.log(result.css)
