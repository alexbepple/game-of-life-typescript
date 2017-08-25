import {assertThat, is, hasSize} from 'hamjest'
import 'mocha'
import r = require('ramda')

type Coord = [number, number]
type Grid = Array<Coord>

const emptyGrid: Grid = []
const coord = (x, y) => <Coord>[x, y]
const setLive = r.append
const setAllLive = r.concat

const isAlive = r.contains
const getNeighborhood = (coord) => {
  const x = r.head(coord)
  const y = r.last(coord)
  return r.difference(r.xprod(r.range(x-1, x+2), r.range(y-1, y+2)), [coord])
}
const countAliveCellsInNeighborhood = (coord, grid) => r.compose(
  r.length,
  r.filter(isAlive(r.__, grid)),
  getNeighborhood
)(coord)
const doesCellStarve = r.lte(r.__, 1)
const shallDie = r.curry(r.binary(r.pipe(
  countAliveCellsInNeighborhood,
  doesCellStarve
)))
const evolve = (grid: Grid) => {
  const cellsToDie = r.filter(shallDie(r.__, grid), grid)
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

describe('Cell in grid', () => {
  it('can be alive', () => {
    const gridWithOneLiveCell = setLive(coord(0,0))(emptyGrid)
    assertThat(isAlive(coord(0, 0), gridWithOneLiveCell), is(true))
    assertThat(isAlive(coord(0, 0), emptyGrid), is(false))
  })
  it('has a neighborhood', () => {
    assertThat(getNeighborhood(coord(0, 0)), hasSize(8))
  })
})