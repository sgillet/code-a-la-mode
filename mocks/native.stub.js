const sinon = require('sinon');
const { Native } = require('../src/main');

class ReadlineStub {
  constructor() {
    this.stub = sinon.stub(Native, 'readline');
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
    this.stub.onCall(6).returns('#.B#0####.#');
    this.stub.onCall(7).returns('#.........#');
    this.stub.onCall(8).returns('#####W#####');
  }

  setupExpectedDishwasherTurn() {
    this.stub.onCall(9).returns('3'); // remaining turns
    this.stub.onCall(10).returns('2 1 NONE'); // player status
    this.stub.onCall(11).returns('7 3 NONE'); // partner status
    this.stub.onCall(12).returns('0'); // table count with items
    this.stub.onCall(13).returns('NONE 0'); // oven
    this.stub.onCall(14).returns('1'); // customers waiting for food
    this.stub.onCall(15).returns('DISH-BLUEBERRIES-ICE_CREAM 649'); // customer waiting (item, award) #1
  }

  setupExpectedDishwasherDespiteTableWithItemsTurn() {
    this.stub.onCall(9).returns('3'); // remaining turns
    this.stub.onCall(10).returns('2 1 NONE'); // player status
    this.stub.onCall(11).returns('7 3 NONE'); // partner status
    this.stub.onCall(12).returns('1'); // table count with items
    this.stub.onCall(13).returns('0 0 DISH-BLUEBERRIES'); // table with items info
    this.stub.onCall(14).returns('NONE 0'); // oven
    this.stub.onCall(15).returns('1'); // customers waiting for food
    this.stub.onCall(16).returns('DISH-BLUEBERRIES-ICE_CREAM 649'); // customer waiting (item, award) #1
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
