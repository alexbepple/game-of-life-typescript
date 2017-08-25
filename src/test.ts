import {assertThat, is} from 'hamjest'
import 'mocha'
import r = require('ramda')

const evolve = r.identity

describe('Next generation of', () => {
  describe('empty grid', () => {
    it('is empty grid', () => {
      const emptyGrid = []
      assertThat(evolve(emptyGrid), is(emptyGrid))
    })
  })
})
