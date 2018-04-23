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
}
