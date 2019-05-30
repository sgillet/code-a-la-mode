const Game = require('../src/game');

describe("Game", () => {
  const line0 = '#####D####I';
  const line1 = '#.........#';
  const line2 = '#.####.##.#';
  const line3 = '#.#..#1.#.#';
  const line4 = '#.B#0####.#';
  const line5 = '#.........#';
  const line6 = '#####W#####';
  let game;
  beforeAll(() => {
    game = new Game(20);
    game.kitchen.addLine(line0);
    game.kitchen.addLine(line1);
    game.kitchen.addLine(line2);
    game.kitchen.addLine(line3);
    game.kitchen.addLine(line4);
    game.kitchen.addLine(line5);
    game.kitchen.addLine(line6);
    game.setElements();
  });
  it("should set the customers count", () => {
    expect(game.customersCount).toBe(20);
  });
  it("should set the remaining turns", () => {
    game.setTurnsRemaining(1);
    expect(game.turnsRemaining).toBe(1);
  });
  describe('Kitchen', () => {
    it("should set the first kitchen line", () => {
      expect(game.kitchen.lines[0]).toBe(line0);
    });
    it("should set the second kitchen line", () => {
      expect(game.kitchen.lines[1]).toBe(line1);
    });
    describe('Dishwasher', () => {
      it('should have its x position set at 5', () => {
        expect(game.kitchen.dishwasher.position.x).toBe(5);
      });
      it('should have its y position set at 0', () => {
        expect(game.kitchen.dishwasher.position.y).toBe(0);
      });
    });
    describe('Window', () => {
      it('should have its x position set at 5', () => {
        expect(game.kitchen.window.position.x).toBe(5);
      });
      it('should have its y position set at 6', () => {
        expect(game.kitchen.window.position.y).toBe(6);
      });
    });
    describe('Ice cream', () => {
      it('should have its x position set at 10', () => {
        expect(game.kitchen.iceCream.position.x).toBe(10);
      });
      it('should have its y position set at 0', () => {
        expect(game.kitchen.iceCream.position.y).toBe(0);
      });
    });
    describe('Blueberry', () => {
      it('should have its x position set at 2', () => {
        expect(game.kitchen.blueberry.position.x).toBe(2);
      });
      it('should have its y position set at 4', () => {
        expect(game.kitchen.blueberry.position.y).toBe(4);
      });
    });
  });
  describe('Player', () => {
    beforeAll(() => {
      game.kitchen.player.updateState(['0', '1', 'NONE']);
    });

    it("should update the player X position", () => {
      expect(game.kitchen.player.position.x).toBe(0);
    });

    it("should update the player Y position", () => {
      expect(game.kitchen.player.position.y).toBe(1);
    });

    it("should update the items the player is holding", () => {
      expect(game.kitchen.player.items).toBe('NONE');
    });
  });
  describe('Partner', () => {
    beforeAll(() => {
      game.kitchen.partner.updateState(['2', '5', 'NONE']);
    });

    it("should update the partner X position", () => {
      expect(game.kitchen.partner.position.x).toBe(2);
    });

    it("should update the partner Y position", () => {
      expect(game.kitchen.partner.position.y).toBe(5);
    });

    it("should update the items the partner is holding", () => {
      expect(game.kitchen.partner.items).toBe('NONE');
    });
  });
});
