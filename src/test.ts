import {assertThat, is} from 'hamjest'
import 'mocha'

describe('foo', () => {
  it('bar', () => {
    assertThat(1+1, is(3))
  })
})

