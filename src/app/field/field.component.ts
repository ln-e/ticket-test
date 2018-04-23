import {Component, Input, OnInit} from '@angular/core';
import {GameNumber} from '../game-number';
import {Ticket} from '../ticket';



@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {

  @Input() ticket: Ticket;
  @Input() priority = {};
  @Input() size = 45;

  constructor() { }

  public ngOnInit(): void {
  }

  public toggleSelected(number: GameNumber): void {
    number.selected = !number.selected;
  }

  public getBg(index, selected: boolean): string {
    const minPriority = 2; // минимум должно совпасть 3 числа чтобы получить хоть какую то прибыль
    const priority = this.priority.hasOwnProperty(index) ? this.priority[index] : 0;
    if (priority < minPriority || this.ticket.selected.length === 0 || this.ticket.selected.length >= 6) {
      return 'transparent';
    }
    const maxPriority = Object.keys(this.priority)
      .map((key) => this.priority[key])
      .reduce((curr, prior) => Math.max(curr, prior), 0);

    const priorityResult = (priority - minPriority + 1) / (maxPriority - minPriority + 1) * 100;

    return 'hsla(0,' + priorityResult + '%,60%,' + priorityResult/100 + ')'; // (priority - 1) / 6 * 100
    // 6 - валидная комбинация // -1 потому что минимальная выигрышная комбинация 2 числа
  }

  public random(): void {
    const random = {};
    while (Object.keys(random).length < 6) {
      random[Math.round(44 * Math.random() + 1)] = true;
    }

    this.ticket.gameNumbers.forEach((number: GameNumber) => {
      number.selected = random.hasOwnProperty(number.index);
    });
  }

}
