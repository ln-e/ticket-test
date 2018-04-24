import {GameNumber} from './game-number';

export class Ticket {
  public gameNumbers: GameNumber[] = [];

  constructor(fieldSize = 45) {
    for (let i = 1; i <= fieldSize; i++) {
      this.gameNumbers.push(new GameNumber(i));
    }
  }

  public get selected(): GameNumber[] {
    return this.gameNumbers.filter((gameNumber: GameNumber) => gameNumber.selected);
  }

  public random(): this {
    const random = {};
    while (Object.keys(random).length < 6) {
      random[Math.round(44 * Math.random() + 1)] = true;
    }

    this.gameNumbers.forEach((number: GameNumber) => {
      number.selected = random.hasOwnProperty(number.index);
    });

    return this;
  }
}
