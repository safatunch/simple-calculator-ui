import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculatorService } from '../services/calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  providers: [CalculatorService]
})


export class CalculatorComponent {
  constructor(private calculationService: CalculatorService, private activeModal: NgbActiveModal) {
  }

  // was planning to implement history, but I think it is not necessary because of the time
  numberList: number[] = []

  private _activeNumber: number = 0;
  get activeNumber(): number {
    return this._activeNumber;
  }
  set activeNumber(value: number) {
    this._activeNumber = value;
    this.Calculate();
  }

  isNumberAdded: boolean = false;
  activeOperator: string = "+";

  result: number = 0
  error: string = ""

  operationDisplay: string = "";


  CalculateRequestTimer?: any;

  GetPreviousNumber = () => this.numberList.length == 0 ? 0 : this.numberList[this.numberList.length - 1];

  readonly maxValue = 2147483647

  OnNumberClick(digit: number) {
    if (this.activeNumber == 0 && digit == 0)
      return;

    var newNumber = parseInt(this.activeNumber + digit.toString());
    if (newNumber > this.maxValue) {
      this.error = "Sorry, you need to study in math for such long numbers. I can calculate values up to " + this.maxValue;
      return;
    }
    this.operationDisplay += digit;
    this.isNumberAdded = true;
    this.activeNumber = newNumber;
  }

  OnOperatorClick(operator: string) {
    // if number is not added, change operator (replace it on display text)
    if (this.isNumberAdded) {
      this.numberList.push(this.activeNumber);

      if (this.numberList.length > 1) {
        this.numberList.push(this.result)
      }

      this.isNumberAdded = false;
      this.activeNumber = 0;
    }
    else {
      if (this.operationDisplay.endsWith(this.activeOperator)) {
        this.operationDisplay = this.operationDisplay.slice(0, -1);
      }
    }

    this.operationDisplay += operator;
    this.activeOperator = operator;
  }

  Calculate() {
    if (this.CalculateRequestTimer) {
      clearTimeout(this.CalculateRequestTimer);
    }

    return new Promise<number>((resolve, reject) => {
      this.CalculateRequestTimer = setTimeout(() => {
        if (this.activeOperator == "+") {
          this.calculationService.AddAsync(this.GetPreviousNumber(), this.activeNumber)
            .then((res: number) => successResult(res))
            .catch((e: string) => this.error = e);
        }
        else if (this.activeOperator == "-") {
          this.calculationService.SubtractAsync(this.GetPreviousNumber(), this.activeNumber)
            .then((res: number) => successResult(res))
            .catch((e: string) => this.error = e);
        }
        const successResult = (res: number) => {
          this.result = res;
          this.error = "";
          this.CalculateRequestTimer = undefined;
          resolve(this.result);
        }
      }, 500)
    })
  }


  Backspace() {
    var number = parseInt(this.operationDisplay[this.operationDisplay.length - 1])
    // if outputs last char is an operator - don't remove
    if (!isNaN(number)) {
      this.operationDisplay = this.operationDisplay.slice(0, -1);
    }
    this.activeNumber = parseInt(this.activeNumber?.toString().slice(0, -1))
    if (isNaN(this.activeNumber))
      this.activeNumber = 0;
  }

  OnEqualClick() {
    this.Calculate()
      .then(() => {
        this.numberList = [];
        this.activeNumber = this.result;
        this.operationDisplay = this.activeNumber.toString();
      })
  }

  CloseModal() {
    this.activeModal.close();
  }
}
