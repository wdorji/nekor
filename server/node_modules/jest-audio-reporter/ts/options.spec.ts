import a from 'assertron'
import path from 'path'
import { processOptions } from './options'

describe('processOptions', () => {
  test('no config returns options with empty array', () => {
    a.satisfies(processOptions({}), {
      onStart: [],
      onSuitePass: [],
      onSuiteFailure: []
    })
  })
  test(`onStartThreshold is parsed as int`, () => {
    a.satisfies(processOptions({ onStartThreshold: '4' }), {
      onStartThreshold: 4
    })
  })
  test('onStartThreshold is default to 10', () => {
    a.satisfies(processOptions({}), {
      onStartThreshold: 10
    })
  })
  test('simple string is convert to entry in array', () => {
    const cwd = process.cwd()
    const config = path.join(cwd, '.jest-audio-reporterrc')
    a.satisfies(processOptions({ onStart: 'audio/onSuitePass/昇格.mp3', config, configs: [config] }), {
      onStart: [path.resolve(cwd, 'audio/onSuitePass/昇格.mp3')]
    })
  })
  test(`support absolute path`, () => {
    const cwd = process.cwd()
    const dirConfig = path.join(__dirname, '.jest-audio-reporterrc')
    const actual = path.resolve(cwd, 'audio/onSuitePass/昇格.mp3')
    a.satisfies(processOptions({ onStart: actual, config: dirConfig, configs: [dirConfig] }), {
      onStart: [actual]
    })
  })
  test(`not exist file is trimmed`, () => {
    const dirConfig = path.join(__dirname, '.jest-audio-reporterrc')
    a.satisfies(processOptions({ onStart: 'not-exist.mp3', config: dirConfig, configs: [dirConfig] }), {
      onStart: a => a.length === 0
    })
  })

  test(`support multiple config`, () => {
    const cwd = process.cwd()
    const config = path.join(cwd, '.jest-audio-reporterrc')
    const dirConfig = path.join(__dirname, '.jest-audio-reporterrc')
    const actual = path.resolve(cwd, 'audio/onSuitePass/昇格.mp3')
    a.satisfies(processOptions({ onStart: actual, config: dirConfig, configs: [config, dirConfig] }), {
      onStart: [actual]
    })

    a.satisfies(processOptions({ onStart: actual, config, configs: [dirConfig, config] }), {
      onStart: [actual]
    })
  })
  test(`support array`, () => {
    const cwd = process.cwd()
    const config = path.join(cwd, '.jest-audio-reporterrc')
    const failureFile = path.resolve(cwd, 'audio/onSuitePass/昇格.mp3')
    const actual = processOptions({
      onSuiteFailure: ['audio/onSuitePass/昇格.mp3'],
      config,
      configs: [config]
    })
    a.satisfies(actual, {
      onSuiteFailure: [failureFile]
    })
  })
})
