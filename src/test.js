"use strict";
exports.__esModule = true;
var hamjest_1 = require("hamjest");
require("mocha");
var r = require("ramda");
var emptyGrid = [];
var coord = function (x, y) { return [x, y]; };
var setLive = r.append;
var setAllLive = r.concat;
var createGrid = setAllLive(r.__, emptyGrid);
var isAlive = r.contains;
var eq = r.binary(r.compose(r.isEmpty, r.difference));
var getNeighborhood = function (coord) {
    var x = r.head(coord);
    var y = r.last(coord);
    return r.difference(r.xprod(r.range(x - 1, x + 2), r.range(y - 1, y + 2)), [coord]);
};
var countAliveCellsInNeighborhood = function (coord, grid) { return r.compose(r.length, r.filter(isAlive(r.__, grid)), getNeighborhood)(coord); };
var neighborhoodSatisfies = r.curry(function (pred, coord, grid) { return pred(countAliveCellsInNeighborhood(coord, grid)); });
var isUnderpopulated = r.lte(r.__, 1);
var isOverpopulated = r.gte(r.__, 4);
var shallDie = neighborhoodSatisfies(r.either(isUnderpopulated, isOverpopulated));
var reproduces = r.equals(3);
var shallBeBorn = neighborhoodSatisfies(reproduces);
var evolve = function (grid) {
    var cellsToDie = r.filter(shallDie(r.__, grid), grid);
    var cellsThatMightBeBorn = r.uniq(r.chain(getNeighborhood, grid));
    var bornCells = r.filter(shallBeBorn(r.__, grid), cellsThatMightBeBorn);
    return r.compose(r.union(bornCells), (r.difference(r.__, cellsToDie)))(grid);
};
describe('Next generation of', function () {
    it('empty grid is empty grid', function () {
        hamjest_1.assertThat(evolve(emptyGrid), hamjest_1.is(emptyGrid));
    });
    it('grid with one live cell is empty grid', function () {
        var gridWithOneLiveCell = createGrid([coord(0, 0)]);
        hamjest_1.assertThat(evolve(gridWithOneLiveCell), hamjest_1.is(emptyGrid));
    });
    it('block is block', function () {
        var block = createGrid([coord(0, 0), coord(0, 1), coord(1, 0), coord(1, 1)]);
        hamjest_1.assertThat(eq(evolve(block), block), hamjest_1.is(true));
    });
    it('vertical blinker is horizontal blinker', function () {
        var verticalBlinker = createGrid([coord(0, 0), coord(0, 1), coord(0, 2)]);
        var horizontalBlinker = createGrid([coord(-1, 1), coord(0, 1), coord(1, 1)]);
        hamjest_1.assertThat(eq(evolve(verticalBlinker), horizontalBlinker), hamjest_1.is(true));
    });
});
describe('Grid', function () {
    it('equals another grid by live cells', function () {
        var grid = createGrid([coord(0, 0), coord(0, 1)]);
        var sameGridDifferentOrder = createGrid([coord(0, 1), coord(0, 0)]);
        hamjest_1.assertThat(eq(grid, sameGridDifferentOrder), hamjest_1.is(true));
    });
});
describe('Cell in grid', function () {
    it('can be alive', function () {
        var grid = createGrid([coord(0, 0)]);
        hamjest_1.assertThat(isAlive(coord(0, 0), grid), hamjest_1.is(true));
        hamjest_1.assertThat(isAlive(coord(0, 0), emptyGrid), hamjest_1.is(false));
    });
    it('has a neighborhood', function () {
        hamjest_1.assertThat(getNeighborhood(coord(0, 0)), hamjest_1.hasSize(8));
    });
    it('dies of starvation', function () {
        var grid = createGrid([coord(0, 0), coord(0, 1)]);
        hamjest_1.assertThat(shallDie(coord(0, 0), grid), hamjest_1.is(true));
    });
    it('dies of overpopulation', function () {
        var grid = createGrid([coord(0, 0), coord(1, 0), coord(0, 1), coord(1, 1), coord(2, 1)]);
        hamjest_1.assertThat(shallDie(coord(1, 0), grid), hamjest_1.is(true));
    });
    it('stays alive otherwise', function () {
        var grid = createGrid([coord(0, 0), coord(0, 1), coord(0, 2)]);
        hamjest_1.assertThat(shallDie(coord(0, 1), grid), hamjest_1.is(false));
    });
});
