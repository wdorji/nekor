import fs from 'fs'
import path from 'path'

export interface Options {
  /**
   * Enable debug mode.
   */
  debug: boolean,
  /**
   * Master volume. 0 (silent) - 1 (normal).
   */
  volume: number,
  /**
   * Volume for onStart. 0 (silent) - 1 (normal).
   * Value higher than Master volume is ignored.
   */
  onStartVolume: number,

  /**
   * Volume for onPass and onFailure. 0 (silent) - 1 (normal).
   * Value higher than Master volume is ignored.
   */
  onCompleteVolume: number,
  disable: boolean
}

export interface RuntimeOptions {
  onStart: string[],
  onStartThreshold: number,
  onSuitePass: string[],
  onSuiteFailure: string[]
}

export function processOptions(rawRCOptions) {
  // reversing the config so the first one is the closest.
  const dirs = rawRCOptions.configs ? rawRCOptions.configs.map(path.dirname) : []
  const onStart = processRCFileEntry(rawRCOptions.onStart, dirs)
  const onSuitePass = processRCFileEntry(rawRCOptions.onSuitePass, dirs)
  const onSuiteFailure = processRCFileEntry(rawRCOptions.onSuiteFailure, dirs)

  const onStartThreshold = rawRCOptions.onStartThreshold !== undefined ? parseInt(rawRCOptions.onStartThreshold, 10) : 10

  return {
    onStartThreshold,
    onStart,
    onSuitePass,
    onSuiteFailure
  }
}

function processRCFileEntry(files: string | string[] | undefined, dirs: string[]) {
  if (!files) return []
  const entries = typeof files === 'string' ? [files] : files
  const validFiles: string[] = []
  entries.forEach(e => {
    if (path.isAbsolute(e)) {
      validFiles.push(e)
    }
    else {
      const file = dirs.map(dir => path.resolve(dir, e)).find(p => fs.existsSync(p))
      if (file) {
        validFiles.push(file)
      }
    }
  })
  return validFiles
}
