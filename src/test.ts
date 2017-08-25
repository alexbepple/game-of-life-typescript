import {assertThat, is} from 'hamjest'
import 'mocha'
import r = require('ramda')

type Coord = [number, number]
type Grid = Array<Coord>

const emptyGrid: Grid = []
const coord = (x, y) => <Coord>[x, y]
const add = r.append
const evolve = (grid: Grid) => emptyGrid

describe('Next generation of', () => {
  it('empty grid is empty grid', () => {
    assertThat(evolve(emptyGrid), is(emptyGrid))
  })
  it('grid with one live cell is empty grid', () => {
    const gridWithOneLiveCell = add(coord(0, 0), emptyGrid)
    assertThat(evolve(gridWithOneLiveCell), is(emptyGrid))
  })
})
