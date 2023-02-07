import { CalculatorService } from "./calculator.service";
import { HttpClient } from "@angular/common/http";
import { of, throwError } from "rxjs";

describe("CalculatorService", () => {
  let calculatorService: CalculatorService;
  let httpClient: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    calculatorService = new CalculatorService(httpClient);
  });

  it("should return the result of adding the number and amount", () => {
    const number = 10;
    const amount = 5;
    const expectedResult = 15;

    httpClient.get.and.returnValue(of(expectedResult));

    calculatorService.AddAsync(number, amount).then(result => {
      expect(result).toEqual(expectedResult);
    });
  });

  it("should return an error message when adding fails", () => {
    const number = 10;
    const amount = 5;

    httpClient.get.and.returnValue(throwError(()=>{}));

    calculatorService.AddAsync(number, amount).catch(error => {
      expect(error).toBe("There is an unexpected error! :/");
    });
  });

  it("should return the result of subtracting the number and amount", () => {
    const number = 10;
    const amount = 5;
    const expectedResult = 5;

    httpClient.get.and.returnValue(of(expectedResult));

    calculatorService.SubtractAsync(number, amount).then(result => {
      expect(result).toEqual(expectedResult);
    });
  });

  it("should return an error message when subtracting fails", () => {
    const number = 10;
    const amount = 5;

    httpClient.get.and.returnValue(throwError(()=>{}));

    calculatorService.SubtractAsync(number, amount).catch(error => {
      expect(error).toBe("There is an unexpected error! :/");
    });
  });
});
