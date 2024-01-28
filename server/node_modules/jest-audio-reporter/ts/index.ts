import { store } from './store'

// istanbul ignore next
process.on('exit', () => {
  if (store.startAudio) store.startAudio.kill()
  if (store.completeAudio) store.completeAudio.kill()
})

import { AudioReporter } from './AudioReporter'

export default AudioReporter
