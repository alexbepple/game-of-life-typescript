import {assertThat, is} from 'hamjest'
import 'mocha'
import r = require('ramda')

type Coord = [number, number]
type Grid = Array<Coord>

const emptyGrid: Grid = []
const coord = (x, y) => <Coord>[x, y]
const setLive = r.append
const setAllLive = r.concat
const evolve = (grid: Grid) => {
  const cellsToDie = r.length(grid) === 1 ? [coord(0, 0)] : []
  return r.difference(grid, cellsToDie)
}

describe('Next generation of', () => {
  it('empty grid is empty grid', () => {
    assertThat(evolve(emptyGrid), is(emptyGrid))
  })
  it('grid with one live cell is empty grid', () => {
    const gridWithOneLiveCell = setLive(coord(0, 0), emptyGrid)
    assertThat(evolve(gridWithOneLiveCell), is(emptyGrid))
  })
  it('block is block', () => {
    const block = setAllLive([
      coord(0, 0),
      coord(0, 1),
      coord(1, 0),
      coord(1, 1)
    ])(emptyGrid)
    assertThat(evolve(block), is(block))
  })
})
