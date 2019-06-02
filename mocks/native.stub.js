const sinon = require('sinon');
const { Native } = require('../src/main');

class ReadlineStub {
  constructor() {
    this.stub = sinon.stub(Native, 'readline');
    this.setupKitchen();
  }

  restore() {
    Native.readline.restore();
  }

  setupKitchen() {
    this.stub.onCall(0).returns('1'); // customer count
    this.stub.onCall(1).returns('DISH-BLUEBERRIES-ICE_CREAM 650'); // customer wish / award
    // kitchen lines
    this.stub.onCall(2).returns('#####D####I');
    this.stub.onCall(3).returns('#.........#');
    this.stub.onCall(4).returns('#.####.##.#');
    this.stub.onCall(5).returns('#.#..#1.#.#');
    this.stub.onCall(6).returns('#.B#0##C#.#');
    this.stub.onCall(7).returns('#.........#');
    this.stub.onCall(8).returns('#####W####S');
  }

  setupTurnDefault() {
    this.stub.onCall(9).returns('3'); // remaining turns
    this.stub.onCall(10).returns('2 1 NONE'); // player status
    this.stub.onCall(11).returns('7 3 NONE'); // partner status
    this.stub.onCall(12).returns('0'); // table count with items
    this.stub.onCall(13).returns('NONE 0'); // oven
    this.stub.onCall(14).returns('1'); // customers waiting for food
    this.stub.onCall(15).returns('DISH-BLUEBERRIES-ICE_CREAM 650'); // customer waiting (item, award) #1
  }

  setupTurnWithDishOnTableDefault() {
    this.setupTurnDefault();
    this.stub.onCall(12).returns('1'); // table count with items
    this.stub.onCall(13).returns('0 0 DISH-ICE_CREAM'); // table with items info
    this.stub.onCall(14).returns('NONE 0'); // oven
    this.stub.onCall(15).returns('1'); // customers waiting for food
    this.stub.onCall(16).returns('DISH-BLUEBERRIES-ICE_CREAM 650'); // customer waiting (item, award) #1
  }

  setupTurnDishwasher() {
    this.setupTurnDefault();
  }

  setupTurnDishwasherDespiteTableWithItem() {
    this.setupTurnWithDishOnTableDefault();
  }

  setupTurnFirstIngredient() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH'); // player status
    this.stub.onCall(15).returns('DISH-ICE_CREAM-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnStrawberries() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 NONE'); // player status
    this.stub.onCall(15).returns('DISH-CHOPPED_STRAWBERRIES-BLUEBERRIES-ICE_CREAM 650'); // customer waiting (item, award) #1
  }

  setupTurnChoppingBoard() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 STRAWBERRIES'); // player status
    this.stub.onCall(15).returns('DISH-CHOPPED_STRAWBERRIES-BLUEBERRIES-ICE_CREAM 650'); // customer waiting (item, award) #1
  }

  setupTurnIceCream() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH'); // player status
    this.stub.onCall(15).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnBlueberries() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH-ICE_CREAM-CHOPPED_STRAWBERRIES'); // player status
    this.stub.onCall(15).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnPlateDown() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH-ICE_CREAM'); // player status
    this.stub.onCall(15).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnStrawberriesAfterPlateDown() {
    this.setupTurnWithDishOnTableDefault();
    this.stub.onCall(13).returns('9 6 DISH-ICE_CREAM'); // table with items info
    this.stub.onCall(16).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnChopStrawberriesAfterPlateDown() {
    this.setupTurnWithDishOnTableDefault();
    this.stub.onCall(10).returns('2 1 STRAWBERRIES'); // player status
    this.stub.onCall(13).returns('9 6 DISH-ICE_CREAM'); // table with items info
    this.stub.onCall(16).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnPickUpDishAfterChoppingStrawberries() {
    this.setupTurnWithDishOnTableDefault();
    this.stub.onCall(10).returns('2 1 CHOPPED_STRAWBERRIES'); // player status
    this.stub.onCall(13).returns('9 6 DISH-ICE_CREAM'); // table with items info
    this.stub.onCall(16).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnWindow() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES'); // player status
    this.stub.onCall(15).returns('DISH-ICE_CREAM-CHOPPED_STRAWBERRIES-BLUEBERRIES 650'); // customer waiting (item, award) #1
  }

  setupTurnIceCreamNextIngredientOfMostExpensiveDish() {
    this.setupTurnDefault();
    this.stub.onCall(10).returns('2 1 DISH'); // player status
    this.stub.onCall(14).returns('2'); // customers waiting for food
    this.stub.onCall(15).returns('DISH-BLUEBERRIES-ICE_CREAM 650'); // customer waiting (item, award) #1
    this.stub.onCall(16).returns('DISH-ICE_CREAM-BLUEBERRIES 1000'); // customer waiting (item, award) #1
  }

  setupTurnPickUpDishWithBlueberriesChoppedStrawberries() {
    this.setupTurnWithDishOnTableDefault();
    this.stub.onCall(10).returns('2 1 NONE'); // player status
    this.stub.onCall(13).returns('9 6 DISH-BLUEBERRIES-CHOPPED_STRAWBERRIES'); // table with items info
    this.stub.onCall(15).returns('2'); // customers waiting for food
    this.stub.onCall(16).returns('DISH-BLUEBERRIES-CHOPPED_STRAWBERRIES_ICE_CREAM 1000'); // customer waiting (item, award) #1
    this.stub.onCall(17).returns('DISH-CHOPPED_STRAWBERRIES-ICE_CREAM 600'); // customer waiting (item, award) #1
  }
}

class LogStub {
  constructor() {
    this.stub = sinon.stub(Native, 'log');
  }

  restore() {
    Native.log.restore();
  }
}

class IsNextTurnStub {
  constructor() {
    this.stub = sinon.stub(Native, 'isNextTurn');
    this.stub.onCall(0).returns(true);
    this.stub.onCall(1).returns(false);
  }

  restore() {
    Native.isNextTurn.restore();
  }
}

class NativeStub {
  constructor() {
      this.isNextTurn = new IsNextTurnStub();
      this.readline = new ReadlineStub();
      this.log = new LogStub();
  }

  restore() {
    this.isNextTurn.restore();
    this.log.restore();
    this.readline.restore();
  }

}

module.exports = NativeStub;
