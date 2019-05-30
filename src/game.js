class Position {
  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
  update(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
}

class Element {
  searchPosition(lines) {
    let position;
    try {
      lines.forEach((line, positionY) => {
        const positionX = line.indexOf(this.symbol);
        if(positionX !== -1) {
          position = (new Position(positionX, positionY));
          throw new Error('position found');
        }
      });
    } catch(error) {
      return position;
    }
  }
}

class Chef extends Element {
  constructor(symbol) {
    super();
    this.items = '';
    this.symbol = symbol;
  }
  updateState(newState) {
    this.position.update(newState[0], newState[1]);
    this.items = newState[2];
  }
}

class Item extends Element {
  setPosition(x,y) {
    this.position.update(x, y);
  }
}

class Blueberry extends Item {
    constructor() {
      super();
      this.symbol = 'B';
    }
}

class Dishwasher extends Item {
  constructor() {
    super();
    this.symbol = 'D';
  }
}

class Window extends Item {
  constructor() {
    super();
    this.symbol = 'W';
  }
}

class IceCream extends Item {
    constructor() {
      super();
      this.symbol = 'I';
    }
}

class Kitchen {
  constructor () {
    this.lines = [];
    this.blueberry = new Blueberry();
    this.dishwasher = new Dishwasher();
    this.iceCream = new IceCream();
    this.player = new Chef(0);
    this.partner = new Chef(1);
    this.window = new Window();
  }
  addLine(line) {
    this.lines.push(line);
  }
  setElements(){
    this.blueberry.position = this.blueberry.searchPosition(this.lines);
    this.dishwasher.position = this.dishwasher.searchPosition(this.lines);
    this.iceCream.position = this.iceCream.searchPosition(this.lines);
    this.player.position = this.player.searchPosition(this.lines);
    this.partner.position = this.partner.searchPosition(this.lines);
    this.window.position = this.window.searchPosition(this.lines);
  }
}

class Orchestrator {
  static getNextMove(kitchen) {
    switch(kitchen.player.items) {
      case 'NONE':
        return `USE ${kitchen.dishwasher.position.x} ${kitchen.dishwasher.position.y}`;
      case 'DISH':
        return `USE ${kitchen.blueberry.position.x} ${kitchen.blueberry.position.y}`;
      case 'DISH-BLUEBERRIES':
        return `USE ${kitchen.iceCream.position.x} ${kitchen.iceCream.position.y}`;
      case 'DISH-BLUEBERRIES-ICE_CREAM':
        return `USE ${kitchen.window.position.x} ${kitchen.window.position.y}`;
      default:
        return 'WAIT';
    }
  }
}

class Customer {
  constructor(wish, award) {
    this.award = award;
    this.wish = wish;
  }
}
class Game {
  constructor(customersCount) {
    this.customersCount = parseInt(customersCount);
    this.kitchen = new Kitchen();
    this.customers = [];
  }
  setTurnsRemaining(turnsRemaining) {
    this.turnsRemaining = turnsRemaining;
  }
  setElements() {
    this.kitchen.setElements();
  }
  addCustomer(wish, award) {
    this.customers.push(new Customer(wish, award));
  }
  getNextMove() {
    return Orchestrator.getNextMove(this.kitchen);
  }
  updatePlayerState(state) {
    this.kitchen.player.updateState(state);
  }
}

module.exports = Game;
