const Game = require('game');

class Native {
  static readline() {
    return readline();
  }
  static isNextTurn() {
    return true;
  }
  static log(output) {
    console.log(output);
  }
}

class Main {
  static init() {
    const customersCount = Native.readline();
    const game = new Game(customersCount);
    for (let i = 0; i < game.customersCount; i++) {
      var inputs = Native.readline().split(' ');
      game.addCustomer(inputs[0], parseInt(inputs[1]))
    }
    for (let i = 0; i < 7; i++) {
      game.kitchen.addLine(Native.readline());
    }
    game.setElements();
    while(Native.isNextTurn()) {
      game.setTurnsRemaining(parseInt(Native.readline()));
      game.updatePlayerState(Native.readline().split(' '));
      Native.readline(); //partner
      const tablesWithItems = parseInt(Native.readline()); //num tables with items
      for(let i = 0; i < tablesWithItems; i++) {
        Native.readline(); //table with item
      }
      Native.readline(); //oven timer
      const numCustomers = Native.readline(); // the number of customers currently waiting for food
      for (let i = 0; i < parseInt(numCustomers); i++) {
        Native.readline().split(' '); // customer waiting (item, award);
      }
      Native.log(game.getNextMove());
    }
  }
}
module.exports = {Main, Native};
