const Game = require('game');

class Native {
  static readline() {
    return readline();
  }
  static isTrue() {
    return true;
  }
}

class Main {
  static init() {
    const game = new Game(Native.readline());
    for (let i = 0; i < game.customersCount; i++) {
      var inputs = Native.readline().split(' ');
      game.addCustomer(inputs[0], parseInt(inputs[1]))
    }
    for (let i = 0; i < 7; i++) {
      game.kitchen.addLine(Native.readline());
    }
    game.setElements();
    while(Native.isTrue()) {
      game.setTurnsRemaining(parseInt(Native.readline()));
      game.updatePlayerState(Native.readline().split(' '));
      Native.readline(); //partner
      Native.readline(); //num tables with items
      Native.readline(); //oven timer
      const numCustomers = Native.readline(); // the number of customers currently waiting for food
      for (let i = 0; i < parseInt(numCustomers); i++) {
        Native.readline().split(' '); // customer waiting (item, award);
      }
      console.log(game.getNextMove());
    }
    return game;
  };
}
module.exports = {Main, Native};
