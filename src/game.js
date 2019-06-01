class Position {
  constructor(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
  update(x, y) {
    this.x = parseInt(x);
    this.y = parseInt(y);
  }
  distanceTo(targetPosition) {
    return Math.abs(this.x - targetPosition.x) + Math.abs(this.y - targetPosition.y);
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

class Strawberries extends Item {
    constructor() {
      super();
      this.symbol = 'S';
    }
}

class ChoppingBoard extends Item {
    constructor() {
      super();
      this.symbol = 'C';
    }
}

class Kitchen {
  constructor () {
    this.choppingBoard = new ChoppingBoard();
    this.blueberry = new Blueberry();
    this.dishwasher = new Dishwasher();
    this.iceCream = new IceCream();
    this.lines = [];
    this.partner = new Chef(1);
    this.player = new Chef(0);
    this.strawberries = new Strawberries();
    this.window = new Window();
  }
  addLine(line) {
    this.lines.push(line);
  }
  setElements(){
    this.blueberry.position = this.blueberry.searchPosition(this.lines);
    this.choppingBoard.position = this.choppingBoard.searchPosition(this.lines);
    this.dishwasher.position = this.dishwasher.searchPosition(this.lines);
    this.iceCream.position = this.iceCream.searchPosition(this.lines);
    this.player.position = this.player.searchPosition(this.lines);
    this.partner.position = this.partner.searchPosition(this.lines);
    this.strawberries.position = this.strawberries.searchPosition(this.lines);
    this.window.position = this.window.searchPosition(this.lines);
    this.availablePositions = this.setAvailablePositions();
  }
  closestAvailablePositionTo(element) {
    const closestPosition = this.availablePositions.reduce((closestPositionSoFar, currentPosition) => {
      if(element.distanceTo(currentPosition) <= element.distanceTo(closestPositionSoFar)) {
        return currentPosition;
      }
      return closestPositionSoFar;
    });
    return closestPosition;
  }
  setAvailablePositions() {
    let availablePositions = [];
    this.lines.forEach((line, positionY) => {
        [...line].forEach((character, positionX) => {
          if(character === '#') {
            availablePositions.push(new Position(positionX, positionY));
          }
        });
    });
    return availablePositions;
  }

}

class Recipe {
  constructor(name) {
    this.name = name;
    this.needPlateDown = false;
  }
  setNextIngredient(currentItems) {
    const baseItems = currentItems === 'NONE' ? 'DISH' : currentItems;
    const regexp = new RegExp(`^${baseItems}-`);
    this.nextIngredient = this.name.replace(regexp, '').split('-')[0];
  }

  getNextStep(currentItems) {
    this.setNextIngredient(currentItems);
    if(currentItems === this.name) {
      return 'WINDOW';
    }
    if(this.nextIngredient === 'CHOPPED_STRAWBERRIES' && currentItems !== 'NONE') {
      return 'PLATE_DOWN';
    }
    if(this.needStrawberries(currentItems)) {
      return 'STRAWBERRIES';
    }
    if(this.needChopping(currentItems)) {
      return 'CHOPPED_STRAWBERRIES';
    }
    if(this.name === 'NONE') {
      return 'DISH';
    }
    const regexp = new RegExp(`^${currentItems}-?`)
    const remainingRecipe = this.name.replace(regexp, '');
    return remainingRecipe.split('-')[0];
  }
  needStrawberries(currentItems) {
    if(currentItems.includes('STRAWBERRIES')) {
      return false;
    }
    if(this.nextIngredient === 'CHOPPED_STRAWBERRIES') {
      return true;
    }
    return false;
  }
  needChopping(currentItems) {
    if(currentItems === 'STRAWBERRIES') {
      return true;
    }
    return false;
  }
}

class Orchestrator {
  static getNextMove(kitchen, customers) {
    const currentRecipe = new Recipe(customers[0].wish);
    const nextStep = currentRecipe.getNextStep(kitchen.player.items);
    switch(nextStep) {
      case 'DISH':
        return `USE ${kitchen.dishwasher.position.x} ${kitchen.dishwasher.position.y}`;
      case 'BLUEBERRIES':
        return `USE ${kitchen.blueberry.position.x} ${kitchen.blueberry.position.y}`;
      case 'CHOPPED_STRAWBERRIES':
        return `USE ${kitchen.choppingBoard.position.x} ${kitchen.choppingBoard.position.y}`;
      case 'ICE_CREAM':
        return `USE ${kitchen.iceCream.position.x} ${kitchen.iceCream.position.y}`;
      case 'PLATE_DOWN':
        const closestAvailablePositionToStrawberries = kitchen.closestAvailablePositionTo(kitchen.strawberries.position);
        return `USE ${closestAvailablePositionToStrawberries.x} ${closestAvailablePositionToStrawberries.y}`;
      case 'STRAWBERRIES':
        return `USE ${kitchen.strawberries.position.x} ${kitchen.strawberries.position.y}`;
      case 'WINDOW':
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
    this.isWaiting = false;
  }

  setIsWaiting(isWaiting) {
    this.isWaiting = isWaiting;
  }
}

class Customers {
  constructor(count) {
    this.count = count;
    this.next = [];
    this.waiting = [];
  }
  addNext(wish, award) {
    this.next.push(new Customer(wish, award));
  }
  setWaiting(customersWaiting) {
    this.waiting = [];
    customersWaiting.forEach(({wish, award}) => {
      this.waiting.push(new Customer(wish, award));
    });
  }
}

class Game {
  constructor(customersCount) {
    this.customers = new Customers(customersCount);
    this.kitchen = new Kitchen();
  }
  setTurnsRemaining(turnsRemaining) {
    this.turnsRemaining = turnsRemaining;
  }
  setElements() {
    this.kitchen.setElements();
  }
  addCustomer(wish, award) {
    this.customers.addNext(wish, award);
  }
  getNextMove() {
    return Orchestrator.getNextMove(this.kitchen, this.customers.waiting);
  }
  updatePlayerState(state) {
    this.kitchen.player.updateState(state);
  }
  updatePartnerState(state) {
    this.kitchen.partner.updateState(state);
  }
  setCustomersWaiting(customersWaiting) {
    this.customers.setWaiting(customersWaiting);
  }
}

module.exports = Game;
