import { store } from './store'

export function createLog() {
  return {
    enabled: false,
    writer: console,
    debug(...args) {
      if (store.devel) return
      if (this.enabled) {
        // istanbul ignore next
        this.writer.info(...args)
      }
    }
  }
}

export function logOptions({ log }, raw, options) {
  if (!raw.configs) {
    log.debug('no config detected')
  }
  else {
    log.debug(`configs location:
${raw.configs.map(c => `  ${c}`).join('\n')}

options:
${JSON.stringify(options, undefined, 2)}
`)
  }
}
