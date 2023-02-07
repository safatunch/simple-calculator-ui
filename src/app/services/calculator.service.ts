
import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import { API_CONFIG } from 'src/configuration/api-config';

@Injectable({
  providedIn: 'root'
})

export class CalculatorService{
  constructor(private httpClient: HttpClient){}

  AddAsync(number: number, amount: number):Promise<number>{
    return new Promise<number>((resolve,reject)=>{
      this.httpClient.get<number>(API_CONFIG.add+number+"/"+amount)
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
      this.httpClient.get<number>(API_CONFIG.subtract + number+"/"+amount)
      .subscribe({
        next: (number)=> resolve(number),
        error: (errordata)=>{
          reject(errordata.error == typeof(String) ? errordata.error : "There is an unexpected error! :/")
        }
      });
    })
  }
}
