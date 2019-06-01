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
    const game = new Game(parseInt(Native.readline()));
    for (let i = 0; i < game.customers.count; i++) {
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
      game.updatePartnerState(Native.readline().split(' '));
      Main.setDishesDown(game);
      Native.readline(); //oven timer
      Main.setCustomersWaiting(game);
      Native.log(game.getNextMove());
    }
  }

  static setDishesDown(game) {
    const dishesDownCount = parseInt(Native.readline());
    let dishesDown = [];
    for(let i = 0; i < dishesDownCount; i++) {
      const dishDown = Native.readline().split(' ');
      dishesDown.push({
        positionX: parseInt(dishDown[0]),
        positionY: parseInt(dishDown[1]),
        recipeName: dishDown[2],
      });
    }
    game.setDishesDown(dishesDown);
  }
  static setCustomersWaiting(game) {
    const numCustomers = Native.readline(); // the number of customers currently waiting for food
    let customersWaiting = [];
    for (let i = 0; i < parseInt(numCustomers); i++) {
      const customerWaiting = Native.readline().split(' ');
      customersWaiting.push({
        wish: customerWaiting[0],
        award: parseInt(customerWaiting[1]),
      });
    }
    game.setCustomersWaiting(customersWaiting); // customer waiting (item, award);
  }
}

module.exports = {Main, Native};
