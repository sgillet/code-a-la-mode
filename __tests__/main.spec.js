const sinon = require('sinon');
const readline = require('readline');
const { Main, Native } = require('../src/main');


describe('Main', () => {
  let stubNativeReadline = sinon.stub(Native, 'readline');
  let stubNativeIsTrue = sinon.stub(Native, 'isTrue');
  let spyConsoleLog = sinon.spy(console, 'log');
  let game;

  beforeAll(() => {
    stubNativeReadline.onCall(0).returns('1');
    stubNativeReadline.onCall(1).returns('DISH-BLUEBERRIES-ICE_CREAM 650');
    stubNativeReadline.onCall(2).returns('#####D####I');
    stubNativeReadline.onCall(3).returns('#.........#');
    stubNativeReadline.onCall(4).returns('#.####.##.#');
    stubNativeReadline.onCall(5).returns('#.#..#1.#.#');
    stubNativeReadline.onCall(6).returns('#.B#0####.#');
    stubNativeReadline.onCall(7).returns('#.........#');
    stubNativeReadline.onCall(8).returns('#####W#####');
    stubNativeReadline.onCall(9).returns('1');
    stubNativeReadline.onCall(10).returns('2 1 NONE');
    stubNativeReadline.onCall(11).returns('7 3 NONE');
    stubNativeReadline.onCall(12).returns('0');
    stubNativeReadline.onCall(13).returns('NONE 0');
    stubNativeReadline.onCall(14).returns('1');
    stubNativeReadline.onCall(15).returns('DISH-BLUEBERRIES-ICE_CREAM 649');

    stubNativeIsTrue.onCall(0).returns(true);
    stubNativeIsTrue.onCall(1).returns(false);

    game = Main.init();
  });

  describe('Game', () => {
    it('should set game customers count', () => {
      expect(game.customersCount).toBe(1);
    });

    it('should set game turns remaining', () => {
      expect(game.turnsRemaining).toBe(1);
    });

    it('should output USE 5 0', () => {
        expect(spyConsoleLog.getCall(0).args[0]).toBe('USE 5 0');
    });

    describe('Customers', () => {
      it('should set the first customer wish', () => {
        expect(game.customers[0].wish).toBe('DISH-BLUEBERRIES-ICE_CREAM');
      });
      it('should set the first customer award', () => {
        expect(game.customers[0].award).toBe(650);
      });
    });

    describe('Kitchen', () => {
      it("should set the first kitchen line", () => {
        expect(game.kitchen.lines[0]).toBe('#####D####I');
      });
    });

    describe('Player', () => {
      it("should update the player x position", () => {
        expect(game.kitchen.player.position.x).toBe(2);
      });
      it("should update the player y position", () => {
        expect(game.kitchen.player.position.y).toBe(1);
      });
      it("should update the player items", () => {
        expect(game.kitchen.player.items).toBe('NONE');
      });
    });
  });
});
