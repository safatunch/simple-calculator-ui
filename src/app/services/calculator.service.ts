
import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})

export class CalculatorService{
  constructor(private httpClient: HttpClient){}

  AddAsync(number: number, amount: number):Promise<number>{
    return new Promise<number>((resolve,reject)=>{
      this.httpClient.get<number>("https://localhost:7233/SimpleCalculator/Add/"+number+"/"+amount)
      .subscribe({
        next: (number)=> resolve(number),
        error: (errordata)=>{
          reject(errordata.error == typeof(String) ? errordata.error : "There is an unexpected error! :/")
        }
      });
    })
  }

  SubtractAsync(number:number, amount:number):Promise<number>{
    return new Promise<number>((resolve,reject)=>{
      this.httpClient.get<number>("https://localhost:7233/SimpleCalculator/Subtract/"+number+"/"+amount)
      .subscribe({
        next: (number)=> resolve(number),
        error: (errordata)=>{
          reject(errordata.error == typeof(String) ? errordata.error : "There is an unexpected error! :/")
        }
      });
    })
  }
}
