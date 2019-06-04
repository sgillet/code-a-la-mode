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
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the ice cream after getting the dish with chopped strawberries', () => {
        nativeStub.readline.setupTurnIceCream();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 0');
      });

      it('should put down the plate close to the chopping board after getting the ice cream', () => {
        nativeStub.readline.setupTurnPlateDown();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 8 4');
      });

      it('should get the strawberries after putting down the plate', () => {
        nativeStub.readline.setupTurnStrawberriesAfterPlateDown();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 6');
      });

      it('should chop the strawberries after getting them', () => {
        nativeStub.readline.setupTurnChopStrawberriesAfterPlateDown();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 7 4');
      });

      it('should pick up the dish after chopping strawberries', () => {
        nativeStub.readline.setupTurnPickUpDishAfterChoppingStrawberries();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 9 6');
      });

      it('should get the blueberries after getting the chopped strawberries', () => {
        nativeStub.readline.setupTurnBlueberries();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 2 4');
      });

      it('should get the dish out the window', () => {
        nativeStub.readline.setupTurnWindow();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 5 6');
      });
    });

    describe('when asked for DISH-BLUEBERRIES-CHOPPED_STRAWBERRIES_ICE_CREAM', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should pick up the dish with blueberries and chopped strawberries', () => {
        nativeStub.readline.setupTurnPickUpDishWithBlueberriesChoppedStrawberries();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 9 6');
      });
    });

    describe('when DISH-ICE_CREAM-BLUEBERRIES is the most expensive dish', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the ice cream when holding a dish', () => {
        nativeStub.readline.setupTurnIceCreamNextIngredientOfMostExpensiveDish();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 10 0');
      });
    });

    describe('when asked for DISH-CROISSANT', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
      });

      afterEach(() => {
        nativeStub.restore();
      });

      it('should get the dough when a dish is laid on a table', () => {
        nativeStub.readline.setupTurnDoughWhenDishOnTable();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 0 6');
      });

      it('should put to oven when holding the dough', () => {
        nativeStub.readline.setupTurnOven();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 0 4');
      });

      it('should pick up plate while the dough is in the oven', () => {
        nativeStub.readline.setupPickUpPlateWhileDoughInOven();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 0 5');
      });

      it('should move in front of the oven when waiting for croissant to finish cooking', () => {
        nativeStub.readline.setupMoveCloseToOvenWhenWaitingForCroissant();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('MOVE 1 4');
      });

      it('should put to oven when holding the dough', () => {
        nativeStub.readline.setupTurnPickUpCroissant();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 0 4');
      });
    });

    describe('when asked for DISH-CROISSANT', () => {
      beforeEach(() => {
        nativeStub = new NativeStub();
      });

      afterEach(() => {
        nativeStub.restore();
      });
      it('should put down the dish with blueberries before taking the dough', () => {
        nativeStub.readline.setupTurnDishWithBlueberriesDownBeforeTakingDough();
        game = Main.init();
        expect(nativeStub.log.stub.getCall(0).args[0]).toBe('USE 0 5');
      });
    });
  });
});
