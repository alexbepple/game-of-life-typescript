import {assertThat, is, hasSize} from 'hamjest'
import 'mocha'
import r = require('ramda')

type Coord = [number, number]
type Grid = Array<Coord>

const emptyGrid: Grid = []
const coord = (x, y) => <Coord>[x, y]
const setLive = r.append
const setAllLive = r.concat
const createGrid = setAllLive(r.__, emptyGrid)

const isAlive = r.contains
const eq = r.binary(r.compose(r.isEmpty, r.difference))

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
const diesOfUnderpopulation = r.lte(r.__, 1)
const diesOfOverpopulation = r.gte(r.__, 4)
const shallDie = r.curry(r.binary(r.pipe(
  countAliveCellsInNeighborhood,
  r.either(diesOfUnderpopulation, diesOfOverpopulation)
)))
const shallBeBorn = r.curry(r.binary(r.pipe(
  countAliveCellsInNeighborhood,
  r.equals(3)
)))
const evolve = (grid: Grid) => {
  const cellsToDie = r.filter(shallDie(r.__, grid), grid)
  const cellsThatMightBeBorn = r.uniq(r.chain(getNeighborhood, grid))
  const bornCells = r.filter(shallBeBorn(r.__, grid), cellsThatMightBeBorn)
  return r.union(bornCells)(r.difference(grid, cellsToDie))
}

describe('Next generation of', () => {
  it('empty grid is empty grid', () => {
    assertThat(evolve(emptyGrid), is(emptyGrid))
  })
  it('grid with one live cell is empty grid', () => {
    const gridWithOneLiveCell = createGrid([coord(0, 0)])
    assertThat(evolve(gridWithOneLiveCell), is(emptyGrid))
  })
  it('block is block', () => {
    const block = createGrid([coord(0, 0), coord(0, 1), coord(1, 0), coord(1, 1)])
    assertThat(eq(evolve(block), block), is(true))
  })
  it('vertical blinker is horizontal blinker', () => {
    const verticalBlinker = createGrid([coord(0, 0), coord(0, 1), coord(0, 2)])
    const horizontalBlinker = createGrid([coord(-1, 1), coord(0, 1), coord(1, 1)])
    assertThat(eq(evolve(verticalBlinker), horizontalBlinker), is(true))
  })
})

describe('Grid', () => {
  it('equals another grid by live cells', () => {
    const grid = createGrid([coord(0, 0), coord(0, 1)])
    const sameGridDifferentOrder = createGrid([coord(0, 1), coord(0, 0)])
    assertThat(eq(grid, sameGridDifferentOrder), is(true))
  })
})

describe('Cell in grid', () => {
  it('can be alive', () => {
    const grid = createGrid([coord(0,0)])
    assertThat(isAlive(coord(0, 0), grid), is(true))
    assertThat(isAlive(coord(0, 0), emptyGrid), is(false))
  })
  it('has a neighborhood', () => {
    assertThat(getNeighborhood(coord(0, 0)), hasSize(8))
  })
  it('dies of starvation', () => {
    const grid = createGrid([coord(0, 0), coord(0, 1)])
    assertThat(shallDie(coord(0, 0), grid), is(true))
  })
  it('dies of overpopulation', () => {
    const grid = createGrid([coord(0, 0), coord(1, 0), coord(0, 1), coord(1, 1), coord(2, 1)])
    assertThat(shallDie(coord(1, 0), grid), is(true))
  })
  it('stays alive otherwise', () => {
    const grid = createGrid([coord(0, 0), coord(0, 1), coord(0, 2)])
    assertThat(shallDie(coord(0, 1), grid), is(false))
  })
})
