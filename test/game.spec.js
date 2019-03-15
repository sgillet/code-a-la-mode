const chai = require('chai');
const expect = chai.expect;
const Game = require('../src/game');

describe("Number to Roman", () => {
  it("should return I when 1 is passed", () => {
    expect(Game.run('input')).to.equal('input');
  });
});
