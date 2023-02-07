import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";

import { CalculatorComponent } from "./calculator.component";
import { CalculatorService } from "../services/calculator.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";



describe("CalculatorComponent", () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CalculatorService, NgbActiveModal],
      declarations: [CalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();


    jasmine.clock().uninstall();
    jasmine.clock().install();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("OnNumberClick", () => {
    it("should do nothing when 0 clicked and activeNumber is 0", async () => {
      component.operationDisplay="0";
      component.activeNumber=0;

      component.OnNumberClick(0);

      expect(component.activeNumber).toBe(0);
      expect(component.operationDisplay).toBe("0");
    });

    it("should update activeNumber", () => {
      component.OnNumberClick(5);
      expect(component.activeNumber).toEqual(5);
    });

    it("should update operationDisplay", () => {
      component.OnNumberClick(5);
      expect(component.operationDisplay).toEqual("5");
    });

    it("should set isNumberAdded to true", () => {
      component.OnNumberClick(5);
      expect(component.isNumberAdded).toEqual(true);
    });

    it("should call calculate function", async () => {
      spyOn(component, "Calculate").and.resolveTo(5);

      component.numberList = [3];

      component.activeOperator = "+";
      component.OnNumberClick(2);

      expect(component.Calculate).toHaveBeenCalled();
    });

    it("should set error if the new number is greater than the maxValue", () => {
      component.OnNumberClick(1);
      component.OnNumberClick(2);
      component.OnNumberClick(3);
      component.OnNumberClick(4);
      component.OnNumberClick(5);
      component.OnNumberClick(6);
      component.OnNumberClick(7);
      component.OnNumberClick(8);
      component.OnNumberClick(1);
      component.OnNumberClick(1);
      component.OnNumberClick(1);
      component.OnNumberClick(1);
      expect(component.error).toEqual("Sorry, you need to study in math for such long numbers. I can calculate values up to 2147483647");
    });
  });

  describe("OnOperatorClick", ()=>{
    it("should set ActiveOperator", ()=>{
      component.OnOperatorClick("-");
      expect(component.activeOperator).toBe("-");

      component.OnOperatorClick("+");
      expect(component.activeOperator).toBe("+");
    })

    it("should add operator to OperationDisplay", ()=>{
      component.operationDisplay="";
      component.OnOperatorClick("-");
      expect(component.operationDisplay).toBe("-");
    })

    it("should replace the Operator in OperationDisplay when isNumberAdded is false", ()=>{
      component.operationDisplay="+";
      component.isNumberAdded = false;

      component.OnOperatorClick("-");
      expect(component.operationDisplay).toBe("-");
      expect(component.operationDisplay.length).toBe(1);

      component.operationDisplay="+";
      component.isNumberAdded = true;

      component.OnOperatorClick("-");
      expect(component.operationDisplay).toBe("+-");
      expect(component.operationDisplay.length).toBe(2);
    })

    it("should add activeNumber to numberList when isNumberAdded is true", ()=>{
      component.activeNumber= 1;
      component.isNumberAdded = false;

      component.OnOperatorClick("-");
      expect(component.numberList.length).toBe(0)

      component.isNumberAdded = true;

      component.OnOperatorClick("-");
      expect(component.numberList.length).toBe(1)
      expect(component.numberList).toContain(1)
    })

    it("should add result to number list when isNumberAdded is true and numberList contains multiple elements", ()=>{
      component.activeNumber= 1;
      //active number will be added to the list as well once operator is clicked
      component.numberList = [1];

      component.isNumberAdded = false;
      component.OnOperatorClick("-");

      expect(component.numberList.length).toBe(1);

      component.isNumberAdded = true;
      component.OnOperatorClick("-");

      expect(component.numberList.length).toBe(3);
    })
  })

  describe("OnBackspaceClick", ()=>{
      it("should remove the last digit from the active number", (done)=>{
        spyOn(component, "Calculate").and.resolveTo();

        component.activeNumber=25;
        component.operationDisplay="5+25";
        component.OnBackspaceClick()
          .then(()=>
          {
            expect(component.operationDisplay).toBe("5+2");
            expect(component.activeNumber).toBe(2);
            done();
          })
      })

      it("should set active number to 0 when there is nothing left on activeNumber",  (done)=>{
        spyOn(component, "Calculate").and.resolveTo();

        component.activeNumber=15;
          Promise.all([ component.OnBackspaceClick(),
           component.OnBackspaceClick()])
           .then(()=>{
            expect(component.activeNumber).toBe(0);

            component.OnBackspaceClick().then(()=>{
              expect(component.activeNumber).toBe(0);
              done();
            })
          });
      })

      it("should set by removing digit of activeNumber", (done)=>{
          spyOn(component, "Calculate").and.resolveTo();

          component.operationDisplay="1+15";

          Promise.all([ component.OnBackspaceClick(),
           component.OnBackspaceClick()])
           .then(()=>{
            expect(component.operationDisplay).toBe("1+");

            component.OnBackspaceClick().then(()=>{
              expect(component.operationDisplay).toBe("1+");
              done();
            })
          });
      })

  })

  describe("OnEqualClick", ()=>{
    beforeEach(()=>{
      spyOn(component, "Calculate").and.resolveTo(5);
    })

    it("should run calculate function", () => {
      component.OnEqualClick();

      expect(component.Calculate).toHaveBeenCalled();
    })

    it("should reset numberList", (done) => {
      component.numberList= [1,5,6];

      component.OnEqualClick().then(()=>{
        expect(component.numberList.length).toBe(0);
        done();
      })
    })

    it("should set activeNumber and operationdisplay to result", (done) => {
      component.activeNumber=3;

      component.OnEqualClick().then(()=>{
        expect(component.activeNumber).toBe(5);
        expect(component.operationDisplay).toBe("5");
        done();
      })
    })
  })

  describe("CloseModal", () => {
    let activeModal: jasmine.SpyObj<NgbActiveModal>;
    beforeEach(()=>{
      activeModal = jasmine.createSpyObj("NgbActiveModal", ["close"]);
      component.activeModal=activeModal;
    })

    it("should call close extension of the modal", () => {
      component.CloseModal();
      expect(activeModal.close).toHaveBeenCalledTimes(1);
    })
  })

  describe("OnClearClick", () => {
    it("should reset all the values", () => {
      expect(component.numberList.length).toBe(0)
      expect(component.activeNumber).toBe(0);
      expect(component.activeOperator).toBe("+");
      expect(component.operationDisplay).toBe("");
      expect(component.result).toBe(0)
      expect(component.error).toBe("");
    })
  })

  describe("Calculate", () => {
    let calculationService: jasmine.SpyObj<CalculatorService>;

    beforeEach(()=>{
      spyOn(component, "GetPreviousNumber").and.returnValue(5);
      calculationService = jasmine.createSpyObj("CalculatorService", ["AddAsync", "SubtractAsync"]);
      component.calculationService=calculationService;
    })

    it("should call related calculation service function according to the operator", (done) => {
      calculationService.AddAsync.and.resolveTo();
      calculationService.SubtractAsync.and.resolveTo();
      component.activeNumber = 3;
      component.activeOperator="+";
      var CalculatePromise = component.Calculate();
      jasmine.clock().tick(500);
      CalculatePromise.then(()=>{
        expect(calculationService.AddAsync).toHaveBeenCalled();

        component.activeOperator="-";
        var CalculatePromise = component.Calculate();
        jasmine.clock().tick(500);

        CalculatePromise.then(()=>{
          expect(calculationService.SubtractAsync).toHaveBeenCalled();
          done();
        });
      })
    })


    it('should set a new timer before calling service function if called multiple times within 500ms', () => {
      calculationService.AddAsync.and.resolveTo();
      component.OnNumberClick(5);
      component.OnOperatorClick("+");
      component.OnNumberClick(15);

      jasmine.clock().tick(499);
      expect(calculationService.AddAsync).not.toHaveBeenCalled();

      jasmine.clock().tick(1);
      expect(calculationService.AddAsync).toHaveBeenCalledTimes(1);
    })

    it("should update result", (done) => {
      calculationService.AddAsync.and.resolveTo(5);
      component.activeNumber = 3;
      component.activeOperator="+";
      var CalculatePromise = component.Calculate();
      jasmine.clock().tick(500);
      CalculatePromise.then(()=>{
        expect(calculationService.AddAsync).toHaveBeenCalled()
        expect(component.result).toBe(5);
        done();
      })
    })

    it("should set error when calculationservice rejects promise", (done) => {
      calculationService.AddAsync.and.rejectWith("some error");
      component.activeNumber = 3;
      component.activeOperator="+";
      var CalculatePromise = component.Calculate();
      jasmine.clock().tick(500);

      CalculatePromise.then(() => done.fail())
        .catch(()=>{
          expect(calculationService.AddAsync).toHaveBeenCalled()
          expect(component.error).toBe("some error");
            done();
      })
    })
  })

});
