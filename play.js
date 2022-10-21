import { createGenerator, escapeSelector } from '@pearofducks/duo-core'
import presetMini from '@pearofducks/duo-preset-fabric'

const uno = createGenerator({
  presets: [
    presetMini({ jit: true })
  ],
})

// const result = await uno.generate('', { preflights: false })
const result = await uno.generate(['sm:bg-blue-600', 'sm:p-16', 'some-fantastic-llama'])
console.log(result.css)
