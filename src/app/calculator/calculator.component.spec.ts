import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';

import { CalculatorComponent } from './calculator.component';
import { CalculatorService } from '../services/calculator.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let calculatorService: CalculatorService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CalculatorService, NgbActiveModal],
      declarations: [CalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    calculatorService = TestBed.inject(CalculatorService);
    fixture.detectChanges();


    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate one number on multiple number clicks', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);

    expect(component.activeNumber).toBe(55);
  })

  it('should add number to the list when operator is clicked', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");

    expect(component.numberList.length).toBe(1);
    expect(component.numberList).toContain(55);
  })

  it('should set update active number after operator', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.activeNumber).toBe(15);
  })

  it('should last element in the number list be previous number', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.numberList.length).toBe(1);
    expect(component.numberList).toContain(55);
  })

  fit('should sum the first value with the second value', (done)=>{
    spyOn(calculatorService, "AddAsync").and.resolveTo(70)
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    component.Calculate().then(()=>{
      expect(component.result).toBe(70);
      done();
    })
  })

  fit('should number list contain total after pressing operator', (done)=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(1);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");

    expect(component.numberList[0]).toBe(55);
    expect(component.numberList[1]).toBe(15);

    setTimeout(() => {
      expect(component.result).toBe(70);
      done();
    }, 500);
  })

  it('shoud be able to continue to operations', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.result).toBe(70);

    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.result).toBe(55);
  })

  it('shoud operator click add result to the numberlist', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);
    component.OnOperatorClick("+");
    component.OnNumberClick(2);
    component.OnNumberClick(0);
    component.OnOperatorClick("+");

    expect(component.numberList.length).toBe(5);
    expect(component.numberList[0]).toBe(55);
    expect(component.numberList[1]).toBe(15);
    expect(component.numberList[2]).toBe(40);
    expect(component.numberList[3]).toBe(20);
    expect(component.numberList[4]).toBe(60);
  })

  it('should operation display have correct display', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");

    expect(component.operationDisplay).toBe("55-15-");
  })

  it('backspace should update active number', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.activeNumber).toBe(15);

    component.Backspace();

    expect(component.activeNumber).toBe(1);
  })

  it('backspace should update result number', async ()=>{
    spyOn(calculatorService, "SubtractAsync").and.resolveTo(40)

    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    component.Calculate().then(() => {
      expect(component.result).toBe(40);
    })

    component.Backspace();

    component.Calculate().then(() => {
      expect(component.result).toBe(54);
    })

    component.Backspace();

    component.Calculate().then(() => {
      expect(component.result).toBe(55);
    })
  })

  it('shoud backspace set active number to 0 when there is not digits left ', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    expect(component.activeNumber).toBe(15);

    component.Backspace();
    component.Backspace();

    expect(component.activeNumber).toBe(0);
  })

  it('shoud backspace remove last digit from the operation display', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    component.Backspace();

    expect(component.operationDisplay).toBe("55-1");
  })

  it('shoud backspace remove last digit from the operation display', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    component.Backspace();
    component.Backspace();

    expect(component.operationDisplay).toBe("55-");
  })

  it('shoud backspace not remove anything if there is not active number', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");
    component.OnNumberClick(1);
    component.OnNumberClick(5);

    component.Backspace();
    component.Backspace();
    component.Backspace();
    component.Backspace();

    expect(component.operationDisplay).toBe("55-");
  })

  it('shoud multiple operator click update active operator', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");

    expect(component.activeOperator).toBe("-")

    component.OnOperatorClick("+");

    expect(component.activeOperator).toBe("+")
  })

  it('should multiple operator click update operation display', ()=>{
    component.OnNumberClick(5);
    component.OnNumberClick(5);
    component.OnOperatorClick("-");

    expect(component.operationDisplay).toBe("55-")

    component.OnOperatorClick("+");

    expect(component.operationDisplay).toBe("55+")
  })

});
