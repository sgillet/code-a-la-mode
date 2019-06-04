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
    this.oven = new Oven();
  }
  updateState(newState) {
    this.position.update(newState[0], newState[1]);
    this.items = newState[2];
  }
  setupTimerForCroissant() {
    this.oven.setupTimerForCroissant();
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

class Dough extends Item {
  constructor() {
    super();
    this.symbol = 'H';
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

class Appliance extends Item {
}

class ChoppingBoard extends Appliance {
    constructor() {
      super();
      this.symbol = 'C';
    }
}

class Oven extends Appliance {
    constructor() {
      super();
      this.item = 'NONE';
      this.symbol = 'O';
      this.timer = 0;
    }
    updateState({item, timer}) {
      this.item = item;
      this.timer = timer;
    }
}

class Kitchen {
  constructor () {
    this.choppingBoard = new ChoppingBoard();
    this.blueberry = new Blueberry();
    this.dough = new Dough();
    this.dishwasher = new Dishwasher();
    this.iceCream = new IceCream();
    this.lines = [];
    this.oven = new Oven();
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
    this.dough.position = this.dough.searchPosition(this.lines);
    this.iceCream.position = this.iceCream.searchPosition(this.lines);
    this.oven.position = this.oven.searchPosition(this.lines);
    this.player.position = this.player.searchPosition(this.lines);
    this.partner.position = this.partner.searchPosition(this.lines);
    this.strawberries.position = this.strawberries.searchPosition(this.lines);
    this.window.position = this.window.searchPosition(this.lines);
    this.availableTables = this.setAvailableSpotsForSymbol('#');
    this.availableFloorCells = this.setAvailableSpotsForSymbol('.');
    this.dishesDown = [];
  }
  closestElementToPosition(elements, position) {
    const closestPosition = elements.reduce((closestPositionSoFar, currentPosition) => {
      if(position.distanceTo(currentPosition) <= position.distanceTo(closestPositionSoFar)) {
        return currentPosition;
      }
      return closestPositionSoFar;
    });
    return closestPosition;
  }
  setAvailableSpotsForSymbol(symbol) {
    let availableSpots = [];
    this.lines.forEach((line, positionY) => {
        [...line].forEach((character, positionX) => {
          if(character === symbol) {
            availableSpots.push(new Position(positionX, positionY));
          }
        });
    });
    return availableSpots;
  }
  setDishesDown(dishesDown) {
    this.dishesDown = [];
    dishesDown.forEach((dish) => {
      this.dishesDown.push(new Dish(dish));
    });
  }
  getDishPositionForRecipe(dishFullName) {
    let dishPosition = this.dishwasher.position;
    this.dishesDown.forEach((dishDown) => {
      const dishDownRegexp = new RegExp(`^${dishDown.recipe.name}.*`);
      if(dishDownRegexp.test(dishFullName)) {
        dishPosition = dishDown.position;
      }
    });
    return dishPosition;
  }
}
class Dish {
    constructor({positionX, positionY, recipeName}) {
      this.position = new Position(positionX, positionY);
      this.recipe = new Recipe(recipeName)
    }
}
class RecipeStep {
  constructor(name) {
    this.name = name;
  }
}
class Recipe {
  constructor(name) {
    this.name = name;
    this.needPlateDown = false;
  }
  setNextIngredient(currentItems, dishesDown) {
    const compatibleDishName = this.getAvailableDishName(dishesDown);
    const baseItems = currentItems === 'NONE' ? compatibleDishName : currentItems;
    const regexp = new RegExp(`^${baseItems}-`);
    this.nextIngredient = this.name.replace(regexp, '').split('-')[0];
  }
  getAvailableDishName(dishes) {
    let availableDishName = 'DISH';
    dishes.forEach((dish) => {
      const dishRegexp = new RegExp(`^${dish.recipe.name}`);
      if(dishRegexp.test(this.name)) {
        availableDishName = dish.recipe.name;
      }
    });
    return availableDishName;
  }

  getNextStep(currentItemsNameInHand, dishesDown, oven) {
    this.setNextIngredient(currentItemsNameInHand, dishesDown);
    if(currentItemsNameInHand === this.name) {
      return new RecipeStep('WINDOW');
    }
    if(this.shouldPickUpCroissant(oven)) {
      return new RecipeStep('OVEN');
    }
    if(this.shouldMoveCloseToOven(currentItemsNameInHand, oven)) {
      return new RecipeStep('MOVE_OVEN');
    }
    if(this.needDough(currentItemsNameInHand, oven)) {
      return new RecipeStep('DOUGH');
    }
    if(this.shouldBake(currentItemsNameInHand)) {
      return new RecipeStep('OVEN');
    }
    if(this.shouldPickUpPlate(currentItemsNameInHand)) {
      return new RecipeStep('DISH_UP');
    }
    if(this.nextIngredient === 'CHOPPED_STRAWBERRIES' && currentItemsNameInHand !== 'NONE') {
      return new RecipeStep('DISH_DOWN');
    }
    if(this.needStrawberries(currentItemsNameInHand, dishesDown)) {
      return new RecipeStep('STRAWBERRIES');
    }
    if(this.needChopping(currentItemsNameInHand)) {
      return new RecipeStep('CHOPPED_STRAWBERRIES');
    }
    if(this.name === 'NONE') {
      return new RecipeStep('DISH');
    }
    const regexp = new RegExp(`^${currentItemsNameInHand}-?`)
    const remainingRecipe = this.name.replace(regexp, '');
    const recipeStepName = remainingRecipe.split('-')[0];
    return new RecipeStep(recipeStepName);
  }
  shouldPickUpCroissant(oven) {
    if(oven.item === 'CROISSANT') {
      return true
    }
    return false
  }
  shouldBake(currentItemsNameInHand) {
    if(currentItemsNameInHand === 'DOUGH') {
      return true;
    }
    return false;
  }
  shouldPickUpPlate(currentItemsNameInHand) {
    if(['NONE', 'CHOPPED_STRAWBERRIES'].includes(currentItemsNameInHand)) {
      if(this.nextIngredient === 'CHOPPED_STRAWBERRIES') {
        return false;
      }
      return true;
    }
    return false;
  }
  shouldMoveCloseToOven(currentItemsNameInHand, oven) {
    if(currentItemsNameInHand !== 'NONE' && oven.item === 'DOUGH') {
      return true;
    }
    return false;
  }
  needDough(currentItemsNameInHand, oven) {
    if(currentItemsNameInHand !== 'NONE') {
      return false;
    }
    if(this.nextIngredient !== 'CROISSANT') {
      return false;
    }
    if(oven.item !== 'NONE') {
      return false
    }
    return true;
  }
  needStrawberries(currentItemsNameInHand) {
    if(currentItemsNameInHand !== 'NONE') {
      return false;
    }
    if(this.nextIngredient === 'CHOPPED_STRAWBERRIES') {
      return true;
    }
    return false;
  }
  needChopping(currentItemsNameInHand) {
    if(currentItemsNameInHand === 'STRAWBERRIES') {
      return true;
    }
    return false;
  }
}

class Orchestrator {
  static getNextMove(kitchen, customers) {
    const currentRecipe = new Recipe(Orchestrator.getMostExpensiveRecipeName(customers));
    const nextStep = currentRecipe.getNextStep(kitchen.player.items, kitchen.dishesDown, kitchen.oven);
    switch(nextStep.name) {
      case 'BLUEBERRIES':
        return `USE ${kitchen.blueberry.position.x} ${kitchen.blueberry.position.y}`;
      case 'CROISSANT':
        const closestFreeTableToOven = kitchen.closestElementToPosition(kitchen.availableTables, kitchen.oven.position);
        return `USE ${closestFreeTableToOven.x} ${closestFreeTableToOven.y}`;
      case 'CHOPPED_STRAWBERRIES':
        return `USE ${kitchen.choppingBoard.position.x} ${kitchen.choppingBoard.position.y}`;
      case 'DISH':
        return `USE ${kitchen.dishwasher.position.x} ${kitchen.dishwasher.position.y}`;
      case 'DISH_DOWN':
        const closestFreeTableToChoppingBoard = kitchen.closestElementToPosition(kitchen.availableTables, kitchen.choppingBoard.position);
        return `USE ${closestFreeTableToChoppingBoard.x} ${closestFreeTableToChoppingBoard.y}`;
      case 'DISH_UP':
        const dishPosition = kitchen.getDishPositionForRecipe(currentRecipe.name);
        return `USE ${dishPosition.x} ${dishPosition.y}`;
      case 'DOUGH':
        return `USE ${kitchen.dough.position.x} ${kitchen.dough.position.y}`;
      case 'ICE_CREAM':
        return `USE ${kitchen.iceCream.position.x} ${kitchen.iceCream.position.y}`;
      case 'MOVE_OVEN':
        const closestFreeSpotToOven = kitchen.closestElementToPosition(kitchen.availableFloorCells, kitchen.oven.position);
        return `MOVE ${closestFreeSpotToOven.x} ${closestFreeSpotToOven.y}`;
      case 'OVEN':
        return `USE ${kitchen.oven.position.x} ${kitchen.oven.position.y}`;
      case 'STRAWBERRIES':
        return `USE ${kitchen.strawberries.position.x} ${kitchen.strawberries.position.y}`;
      case 'WINDOW':
        return `USE ${kitchen.window.position.x} ${kitchen.window.position.y}`;
      default:
        return 'WAIT';
    }
  }
  static getMostExpensiveRecipeName(customers) {
    const customerWithHighestAward = customers.reduce((customerWithHighestAwardSoFar, currentCustomer) => {
      if(currentCustomer.award > customerWithHighestAwardSoFar.award) {
        return currentCustomer;
      }
      return customerWithHighestAwardSoFar;
    });
    return customerWithHighestAward.wish;
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
  updateOvenState(state) {
    this.kitchen.oven.updateState(state);
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
  setDishesDown(dishesDown) {
    this.kitchen.setDishesDown(dishesDown);
  }
}

module.exports = Game;
