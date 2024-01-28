import type { ReporterOnStartOptions } from '@jest/reporters'
import type { AggregatedResult } from '@jest/test-result'
import type { Config } from '@jest/types'
import Player from 'play-sound'
import rc from 'rc'

import { createLog, logOptions } from './log'
import { Options, processOptions, RuntimeOptions } from './options'
import { store } from './store'

export class AudioReporter {
  log = createLog()
  player
  disable: boolean
  options: RuntimeOptions
  volume: number | undefined
  onStartVolume: number
  onCompleteVolume: number | undefined
  constructor(public globalConfig: Config.GlobalConfig, jestOptions: Partial<Options>) {
    if (jestOptions.debug) {
      this.log.enabled = true
    }
    this.player = Player({})
    this.disable = !!jestOptions.disable
    this.volume = jestOptions.volume
    this.onStartVolume = jestOptions.onStartVolume || 0.5
    this.onCompleteVolume = jestOptions.onCompleteVolume

    const rawRCOptions = rc('jest-audio-reporter')
    const rcOptions = processOptions(rawRCOptions)
    logOptions({ log: this.log }, rawRCOptions, rcOptions)
    this.options = rcOptions
  }
  onRunStart(results: AggregatedResult, options: ReporterOnStartOptions) {
    if (this.disable) return

    if (store.completeAudio) {
      store.completeAudio.kill()
      store.completeAudio = undefined
    }

    if (results.numTotalTestSuites === 0 ||
      options.estimatedTime > 0 &&
      options.estimatedTime <= this.options.onStartThreshold) return

    const file = pickOne(this.options.onStart)
    const volume = this.getEffectiveOnStartVolume()
    store.startAudio = this.player.play(file, this.getPlayOption({ volume }))
  }
  onRunComplete(_contexts, results: AggregatedResult) {
    if (this.disable) return

    if (store.startAudio) {
      store.startAudio.kill()
      store.startAudio = undefined
    }
    if (results.numTotalTestSuites === 0) return
    if (results.wasInterrupted) return

    if (results.numFailedTestSuites === 0) {
      if (isWatch(this.globalConfig) && store.doesLastRunPass) return
      store.doesLastRunPass = true
      return this.playComplete(pickOne(this.options.onSuitePass))
    }
    else {
      store.doesLastRunPass = false
      return this.playComplete(pickOne(this.options.onSuiteFailure))
    }
  }
  private playComplete(file: string | undefined) {
    if (!file) return
    const volume = this.getEffectiveOnCompleteVolume()
    if (isWatch(this.globalConfig)) {
      store.completeAudio = this.player.play(file, this.getPlayOption({ volume }))
    }
    else {
      return new Promise(a => {
        store.completeAudio = this.player.play(file, this.getPlayOption({ volume }), a)
      })
    }
  }
  private getEffectiveOnStartVolume() {
    return Math.min(this.volume || 1, this.onStartVolume)
  }
  private getEffectiveOnCompleteVolume() {
    return Math.min(this.volume || 1, this.onCompleteVolume || 1)
  }
  private getPlayOption(option) {
    switch (this.player.player) {
      case 'afplay':
        return getAfPlayOption(option)
      case 'mplayer':
        return getMplayerOption(option)
      default:
        return {}
    }
  }
}

function pickOne(arr: Array<any>) {
  if (arr.length === 0) return undefined
  return arr[Math.floor(Math.random() * arr.length)]
}

function isWatch(globalConfig) {
  return globalConfig.watch || globalConfig.watchAll
}

function getAfPlayOption({ volume }: { volume: number }) {
  // https://ss64.com/osx/afplay.html
  // According to the link, the volume is logarithmic,
  // but I'm not sure what does it mean, as:
  // log(1) = 0
  // log(0.1) = -1
  // log(0) = -infinity
  // So for now, I treat [0, 1] as linear
  return { afplay: ['-v', 1 / (Math.pow(10, Math.log2(1 / volume)))] }
}

function getMplayerOption({ volume }: { volume: number }) {
  // http://www.mplayerhq.hu/DOCS/man/en/mplayer.1.html search for "-volume"
  return { mplayer: ['-volume', volume * 100] }
}
