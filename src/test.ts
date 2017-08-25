import {assertThat, is} from 'hamjest'
import 'mocha'
import r = require('ramda')

type Coord = [number, number]
type Grid = Array<Coord>

const emptyGrid: Grid = []
const evolve = r.always(emptyGrid)

describe('Next generation of', () => {
  describe('empty grid', () => {
    it('is empty grid', () => {
      assertThat(evolve(emptyGrid), is(emptyGrid))
    })
  })
  describe('grid with one live cell', () => {
    it('is empty grid', () => {
      const gridWithOneLiveCell: Grid = [[0,0]]
      assertThat(evolve(gridWithOneLiveCell), is(emptyGrid))
    })
  })
})
