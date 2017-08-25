import {assertThat, is} from 'hamjest'
import 'mocha'
import r = require('ramda')

const emptyGrid = []
const evolve = r.always(emptyGrid)

describe('Next generation of', () => {
  describe('empty grid', () => {
    it('is empty grid', () => {
      assertThat(evolve(emptyGrid), is(emptyGrid))
    })
  })
  describe('grid with one live cell', () => {
    it('is empty grid', () => {
      const gridWithOneLiveCell = [[0,0]]
      assertThat(evolve(gridWithOneLiveCell), is(emptyGrid))
    })
  })
})
