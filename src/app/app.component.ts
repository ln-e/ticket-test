import {Component, DoCheck} from '@angular/core';
import {Ticket} from './ticket';
import {GameNumber} from './game-number';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  public ticketDraw = new Ticket();
  public tickets: Ticket[] = [
    new Ticket().random(),
    new Ticket().random(),
  ];
  public valid = 6;
  public size = 45;
  public priority = {};
  public ticketCount = 2;
  public countOfMatches = {};

  public mathFactorialCache = {};

  addField() {
    this.tickets.push(new Ticket());
  }

  ngDoCheck() {
    const selected = this.ticketDraw.selected;

    const numbersFromTickets = []
      .concat(...this.tickets.map((ticket: Ticket) => ticket.selected))
      .filter((el: GameNumber, i, numbers) => {
        return numbers.findIndex((number: GameNumber) => number.index === el.index) === i;
      });

    const numberFromTicketsNotSelected = numbersFromTickets
      .filter((number: GameNumber) => {
        return selected.findIndex((el: GameNumber) => number.index === el.index) === -1;
      });

    const numbersLeft = this.valid - selected.length;
    const countOfTickets = this.getMathCombinationOfASet(numbersLeft, numberFromTicketsNotSelected.length);

    const priority = {};
    this.tickets.forEach((ticket: Ticket) => {
      const countOfMatchedNumbers = this.matches(ticket);
      const countOfProbablyMatchedNumbers = countOfMatchedNumbers + numbersLeft; // сколько максимально в этом билете может совпасть
      ticket.selected.forEach((number: GameNumber) => {
        priority[number.index] = Math.max(priority[number.index] || 0, countOfProbablyMatchedNumbers); // минус один потому что  минимальная комбинация чтобы выиграть 2 числа
      });
    });

    this.priority = priority;

    this.countOfMatches = {6: 0, 5: 0, 4: 0, 3: 0, 2: 0};
    this.tickets.forEach((ticket) => {
      this.countOfMatches[this.matches(ticket)] += 1;
    });
  }

  generate() {
    if (this.tickets.length > this.ticketCount) {
      this.tickets.splice(this.ticketCount - 1);
    } else {
      while (this.tickets.length < this.ticketCount) {
        const ticket = new Ticket();

        this.tickets.push(ticket);
      }
    }

    this.tickets.forEach((ticket) => {
      ticket.random();
    });
  }

  createPermutationArray(array: any[], count: number) {
    // return window['Combinatorics'].combination(array, count);
  }

  getMathCombinationOfASet(k, n) {
    if (k > n) {
      return 0;
    } else {
      return Math.round(this.mathFactorial(n) /
        (this.mathFactorial(k) * this.mathFactorial(n - k)));
    }
  }

  mathFactorial(num) {
    if (!isNaN(num) && num < 0) {
      throw Error('Input number must be non negative number. Found: ' + num);
    }

    if (this.mathFactorialCache[num] === undefined) {
      if (num === 0) {
        this.mathFactorialCache[num] = 1;
      } else {
        this.mathFactorialCache[num] = num * this.mathFactorial(num - 1);
      }
    }

    return this.mathFactorialCache[num];
  };


  public matches(ticket: Ticket) {
    const selected = this.ticketDraw.selected;

    return ticket.selected.reduce((prev, number: GameNumber) => {
      const hasNumber = selected.findIndex((suggested: GameNumber) => suggested.index === number.index) !== -1;
      return prev + (hasNumber ? 1 : 0);
    }, 0);
  }
}
