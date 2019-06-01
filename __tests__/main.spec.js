const sinon = require('sinon');
const { Main, Native } = require('../src/main');
const NativeStub = require('../mocks/native.stub');


describe('Main', () => {
  describe('Game', () => {
    let game;
    let nativeStub;

    describe('when asked for DISH-BLUEBERRIES-ICE_CREAM', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
        nativeStub.readline.setupKitchen();
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the dishwasher', () => {
        nativeStub.readline.setupTurnDishwasher();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 5 0');
      });

      it('should get the dishwasher despite table with items', () => {
        nativeStub.readline.setupTurnDishwasherDespiteTableWithItem();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 5 0');
      });
    });

    describe('when asked for DISH-ICE_CREAM-BLUEBERRIES', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
        nativeStub.readline.setupKitchen('DISH-ICE_CREAM-BLUEBERRIES 650');
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the first ingredient (ice cream) after getting the dish', () => {
        nativeStub.readline.setupTurnFirstIngredient();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 0');
      });
    });

    describe('when asked for DISH-CHOPPED_STRAWBERRIES-BLUEBERRIES-ICE_CREAM', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
        nativeStub.readline.setupKitchen('DISH-CHOPPED_STRAWBERRIES-BLUEBERRIES-ICE_CREAM 650');
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the first ingredient (strawberries) after getting the dish', () => {
        nativeStub.readline.setupTurnStrawberries();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 6');
      });

      it('should chop strawberries when in hand', () => {
        nativeStub.readline.setupTurnChoppingBoard();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 7 4');
      });
    });

    describe('when asked for DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
        nativeStub.readline.setupKitchen('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650');
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the ice cream after getting the dish with chopped strawberries', () => {
        nativeStub.readline.setupTurnIceCream();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 0');
      });

      it('should put down the plate close to the strawberries after getting the ice cream', () => {
        nativeStub.readline.setupTurnPlateDown();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 9 6');
      });

      it('should get the blueberries after getting the chopped strawberries', () => {
        nativeStub.readline.setupTurnBlueberries();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 2 4');
      });
    });
  });
});
