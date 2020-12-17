import t from 'tap'
import { run } from './helpers.js'

/* eslint-disable @typescript-eslint/no-floating-promises -- ugh */

t.test('cli', async (t) => {
  const { stderr } = await run()
  t.match(stderr, 'Count those tree rings!')
})
