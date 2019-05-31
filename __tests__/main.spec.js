const sinon = require('sinon');
const { Main, Native } = require('../src/main');
const NativeStub = require('../mocks/native.stub');


describe('Main', () => {
  describe('Game', () => {
    let game;
    let nativeStub;

    describe('when dishwasher is expected as next move', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
        nativeStub.readline.setupKitchen();
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should output USE 5 0', () => {
        nativeStub.readline.setupExpectedDishwasherTurn();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 5 0');
      });

      it('should output USE 5 0 even when table with items is present', () => {
        nativeStub.readline.setupExpectedDishwasherDespiteTableWithItemsTurn();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 5 0');
      });
    });
  });
});
