
const init = () => {
  const game = new Game(parseInt(readline()));
  for (let i = 0; i < game.customersCount; i++) {
    var inputs = readline().split(' ');
    console.error('customerItem, customerAward', inputs);
    const customerItem = inputs[0]; // the food the customer is waiting for
    const customerAward = parseInt(inputs[1]); // the number of points awarded for delivering the food
  }
  for (let i = 0; i < 7; i++) {
    game.kitchen.addLine(readline());
  }
  game.setElements();
  while(true) {
    game.setTurnsRemaining(readline());
    game.updatePlayerState(readline().split(' '));
    console.error('playerX, playerY', game.kitchen.player.position.x, game.kitchen.player.position.y, game.kitchen.player.items);
    console.error('partnerX, partnerY', readline().split(' '));
    console.error('numTablesWithItems', parseInt(readline()));
    console.error('ovenContents, ovenTimer', readline().split(' ')); // ignore until wood 1 league
    const numCustomers = parseInt(readline()); // the number of customers currently waiting for food
    console.error('numCustomers', numCustomers);
    for (let i = 0; i < numCustomers; i++) {
        console.error('customer waiting: item, award', readline().split(' '));
    }
    console.log(game.getNextMove());
  }
};

init();
