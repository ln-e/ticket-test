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
    new Ticket(),
    new Ticket(),
  ];
  public valid = 6;
  public size = 45;
  public priority = {};

  public mathFactorialCache = {};

  addField() {
    this.tickets.push(new Ticket());
  }

  ngDoCheck() {
    const selected = this.ticketDraw.selected;
    if (!selected.length) {
      return;
    }


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

    // console.log('numbersFromTickets', numbersFromTickets, this.valid - selected.length, numberFromTicketsNotSelected.length - selected.length);
    const countOfTickets = this.getMathCombinationOfASet(numbersLeft, numberFromTicketsNotSelected.length);
    // console.log('нужно перебрать ', countOfTickets, numbersLeft, numberFromTicketsNotSelected.length);

    const priority = {};
    this.tickets.forEach((ticket: Ticket) => {
      const countOfMatchedNumbers = this.matches(ticket);
      const countOfProbablyMatchedNumbers = countOfMatchedNumbers + numbersLeft; // сколько максимально в этом билете может совпасть
      console.log('countOfMatchedNumbers', countOfMatchedNumbers, 'countOfProbablyMatchedNumbers', countOfProbablyMatchedNumbers, 'ticket.selected', ticket.selected);
      ticket.selected.forEach((number: GameNumber) => {
        priority[number.index] = Math.max(priority[number.index] || 0, countOfProbablyMatchedNumbers); // минус один потому что  минимальная комбинация чтобы выиграть 2 числа
      });
    });

    this.priority = priority;
    console.log(priority);
    /*
    this.createPermutationArray(numberFromTicketsNotSelected, numbersLeft).forEach((combination) => {
      const suggestedCombination = combination.concat(...selected);

      this.tickets.forEach((ticket: Ticket) => {
        const numbersInCommon = ticket.selected.reduce((prev, number: GameNumber) => {
          const hasNumber = suggestedCombination.findIndex((suggested: GameNumber) => suggested.index === number.index) !== -1;
          return prev + (hasNumber ? 1 : 0);
        }, 0);
        console.log(' при таких выпавших числах будет угаданно', numbersInCommon);
        suggestedCombination.forEach((number: GameNumber) => {
          priority[number.index] = Math.max(priority[number.index] || 0, numbersInCommon);
        });
      });
      // console.log('suggestedCombination ', suggestedCombination );
    });

    console.log('priority ', priority);
    this.priority = priority; /*Object.keys(priority).map((numberIndex) => {
      return {index: numberIndex, priority: priority[numberIndex]};
    });*/
  }

  createPermutationArray(array: any[], count: number) {
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
