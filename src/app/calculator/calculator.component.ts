import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CalculatorService } from '../services/calculator.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  providers: [CalculatorService]
})


export class CalculatorComponent {
  constructor(public calculationService: CalculatorService, public activeModal: NgbActiveModal) {
  }

  // was planning to implement history, but I think it is not necessary because of the time
  numberList: number[] = []

  private _activeNumber: number = 0;
  get activeNumber(): number {
    return this._activeNumber;
  }
  set activeNumber(value: number) {
    this._activeNumber = value;
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
    this.Calculate();
  }

  OnOperatorClick(operator: string) {
    // if number is not added, change operator (replace it on display text)
    if (this.isNumberAdded) {
      this.numberList.push(this.activeNumber);

      if (this.numberList.length > 1)
      {
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

  async Calculate() {
    if (this.CalculateRequestTimer) {
      clearTimeout(this.CalculateRequestTimer);
    }

    return new Promise<number>((resolve, reject) => {
        this.CalculateRequestTimer = setTimeout(() => {
      if (this.activeOperator == "+") {
          this.calculationService.AddAsync(this.GetPreviousNumber(), this.activeNumber)
            .then((res: number) => handleSuccess(res))
            .catch((e: string) => reject(this.error = e));
        }
        else if (this.activeOperator == "-") {
          this.calculationService.SubtractAsync(this.GetPreviousNumber(), this.activeNumber)
            .then((res: number) => handleSuccess(res))
            .catch((e: string) => reject(this.error = e));
        }

        const handleSuccess = (res: number) => {
          this.result = res;
          this.error = "";
          this.CalculateRequestTimer = undefined;
          resolve(this.result);
        }
      }, 500)
    })
  }


  async OnBackspaceClick() {
    var number = parseInt(this.operationDisplay[this.operationDisplay.length - 1])
    // if outputs last char is an operator - don't remove
    if (!isNaN(number)) {
      this.operationDisplay = this.operationDisplay.slice(0, -1);
    }
    this.activeNumber = parseInt(this.activeNumber?.toString().slice(0, -1))
    if (isNaN(this.activeNumber)){
      this.activeNumber = 0;
      this.isNumberAdded=false;
    }

    await this.Calculate();
  }

  async OnEqualClick() {
    var result = await this.Calculate()
        this.numberList = [];
        this.activeNumber = result;
        this.operationDisplay = this.activeNumber.toString();
        this.activeOperator="+";
  }

  OnClearClick(){
    this.numberList=[]
    this.activeNumber=0;
    this.operationDisplay="";
    this.result=0;
    this.error="";
    this.activeOperator="+";
  }

  CloseModal() {
    this.activeModal.close();
  }
}
