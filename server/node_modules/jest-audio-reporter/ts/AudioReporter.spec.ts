import { ReporterOnStartOptions } from '@jest/reporters'
import { AggregatedResult } from '@jest/test-result'
import { Config } from '@jest/types'
import t from 'assert'
import { AssertOrder } from 'assertron'
import AudioReporter from '.'
import { RuntimeOptions } from './options'
import { store } from './store'

test('Will not play onSuitePass if no test ran', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunComplete({}, ar({ numTotalTestSuites: 0 }))
})

test('Will not play onStart if test estimated to take less than 10s to run', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuitePass: ['audio/onSuitePass/昇格.mp3']
  })

  subject.player = { play() { throw new Error('should not play') } }
  subject.onRunStart(ar(), { estimatedTime: 10, showStatus: false })
})

test('Will play onStart if test estimated to take more than 10s to run', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar(), { estimatedTime: 10.01, showStatus: false })

  o.end()
})

test('Will play onStart if there is no estimate', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({ onSuitePass: ['audio/onSuitePass/昇格.mp3'] })

  const o = new AssertOrder(1)
  subject.player = { play() { o.once(1) } }
  subject.onRunStart(ar({ numTotalTestSuites: 1 }), { estimatedTime: 0, showStatus: false })

  o.end()
})

test('pick one if onStart has more than one entry', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onStart: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })

  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onStart.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunStart(ar(), { estimatedTime: 10.01, showStatus: false })

  t(calls[0] * calls[1] > 0)
})
test('pick one if onSuitePass is an array', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuitePass: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })
  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onSuitePass.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))

  t(calls[0] * calls[1] > 0)
})
test('pick one if onSuiteFailure is an array', () => {
  const subject = new AudioReporter(gc(), {})
  subject.options = runtimeOptions({
    onSuiteFailure: ['audio/onSuitePass/昇格.mp3', 'audio/onSuitePass/勝利ジングル.mp3']
  })
  const calls = [0, 0]
  subject.player = {
    play(file) {
      calls[subject.options.onSuiteFailure.indexOf(file)]++
    }
  }
  for (let i = 0; i < 100; i++)
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))

  t(calls[0] * calls[1] > 0)
})

describe('watch mode', () => {
  test('play onSuitePass on first run', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass on second pass', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { o.once(1) } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('play onSuitePass again on pass after failure', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()
    const o = new AssertOrder(1)
    subject.player = {
      play() {
        o.exactly(1, 3)
      }
    }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    o.end()
  })
  test('do not play onSuitePass/Failure on interruption', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onSuitePass: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    subject.player = { play() { throw new Error('should not play') } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0, wasInterrupted: true }))
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1, wasInterrupted: true }))
  })
  test('kill onStart when run completes', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunStart(ar(), { estimatedTime: 11, showStatus: false })
    subject.onRunComplete({}, ar())
    o.end()
  })
  test('kill onSuitePass when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3'],
      onSuitePass: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 0 }))
    subject.onRunStart(ar(), { estimatedTime: 11, showStatus: false })
    o.end()
  })
  test('kill onSuiteFailure when run starts', () => {
    const subject = new AudioReporter(gc({ watch: true }), {})
    subject.options = runtimeOptions({
      onStart: ['audio/onSuitePass/昇格.mp3'],
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3']
    })
    store.reset()

    const o = new AssertOrder(1)
    subject.player = { play() { return { kill() { o.once(1) } } } }
    subject.onRunComplete({}, ar({ numTotalTestSuites: 1, numFailedTestSuites: 1 }))
    subject.onRunStart(ar(), { estimatedTime: 11, showStatus: false })
    o.end()
  })
})

test('when debug = true, log is enabled', () => {
  store.devel = true
  try {
    const subject = new AudioReporter(gc(), { debug: true })
    t.strictEqual(subject.log.enabled, true)
  }
  catch {
    store.devel = false
  }
})

test('when debug = false, log is not enabled', () => {
  const subject = new AudioReporter(gc(), { debug: false })
  t.strictEqual(subject.log.enabled, false)
})

test('lower master volume in OSX affect onStart', () => {
  const subject = new AudioReporter(gc(), { volume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 0.01] })
})

test('lower master volume in OSX affect onComplete', () => {
  const subject = new AudioReporter(gc(), { volume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 0.01] })
})

test('lower master volume in Windows affect onStart', () => {
  const subject = new AudioReporter(gc(), { volume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 25] })
})

test('lower master volume in Windows affect onComplete', () => {
  const subject = new AudioReporter(gc(), { volume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 25] })
})

test('lower onStartVolume in OSX affect onStart', () => {
  const subject = new AudioReporter(gc(), { onStartVolume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 0.01] })
})

test('lower onStartVolume in OSX will not affect onComplete', () => {
  const subject = new AudioReporter(gc(), { onStartVolume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 1] })
})

test('lower onStartVolume in Windows affect onStart', () => {
  const subject = new AudioReporter(gc(), { onStartVolume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 25] })
})

test('lower onStartVolume in Windows will not affect onComplete', () => {
  const subject = new AudioReporter(gc(), { onStartVolume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 100] })
})

test('lower onCompleteVolume in OSX will not affect onStart', () => {
  const subject = new AudioReporter(gc(), { onCompleteVolume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 0.1] })
})

test('lower onCompleteVolume in OSX affect onComplete', () => {
  const subject = new AudioReporter(gc(), { onCompleteVolume: 0.25 })
  let actual
  subject.player = { player: 'afplay', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { afplay: ['-v', 0.01] })
})

test('lower onCompleteVolume in Windows will not affect onStart', () => {
  const subject = new AudioReporter(gc(), { onCompleteVolume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 50] })
})

test('lower onCompleteVolume in Windows affect onComplete', () => {
  const subject = new AudioReporter(gc(), { onCompleteVolume: 0.25 })
  let actual
  subject.player = { player: 'mplayer', play(_file, option) { actual = option } }

  subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
  t.deepStrictEqual(actual, { mplayer: ['-volume', 25] })
})

test('disable will not play when complete', async () => {
  const subject = new AudioReporter(gc(), { disable: true })
  subject.player = { player: 'mplayer', play() { throw new Error('should not call') } }
  await subject.onRunComplete(undefined, ar({ numTotalTestSuites: 1 }))
})

test('disable will not play when complete', () => {
  const subject = new AudioReporter(gc(), { disable: true })
  subject.player = { player: 'mplayer', play() { throw new Error('should not call') } }
  subject.onRunStart(ar({ numTotalTestSuites: 1 }), roso({ estimatedTime: 11 }))
})

function gc(config: Partial<Config.GlobalConfig> = {}) {
  return config as Config.GlobalConfig
}

function ar(results: Partial<AggregatedResult> = {}) {
  return results as AggregatedResult
}

function roso(options: Partial<ReporterOnStartOptions> = {}) {
  return options as ReporterOnStartOptions
}

function runtimeOptions(options: Partial<RuntimeOptions>) {
  return {
    onStart: [],
    onSuitePass: [],
    onSuiteFailure: [],
    onStartThreshold: 10,
    ...options
  }
}
