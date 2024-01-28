import t from 'assert'
import { logOptions, createLog } from './log';

test('enabled log will print', () => {
  const log = createLog()
  log.enabled = true
  let actual
  log.writer = { info(msg) { actual = msg } } as any
  log.debug('should print')
  t.strictEqual(actual, 'should print')
})

test('log config location and option', () => {
  const c = context()
  logOptions(c, {
    onSuitePass: ['music1.mp3'],
    configs: [
      'rcfile1',
      'rcfile2'
    ]
  }, { onSuitePass: ['music1.mp3'] })
  t.deepStrictEqual(c.log.messages, [
    [`configs location:
  rcfile1
  rcfile2

options:
{
  "onSuitePass": [
    "music1.mp3"
  ]
}
`]
  ])
})

test('no config prints no config detected', () => {
  const log = createLog()
  log.enabled = true
  let actual
  log.writer = { info(msg) { actual = msg } } as any
  logOptions({ log }, {}, undefined)
  t.strictEqual(actual, 'no config detected')
})

function context() {
  return {
    log: {
      debug(...args) {
        this.messages.push(args)
      },
      messages: []
    }
  }
}
