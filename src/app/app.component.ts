import { Component } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CalculatorComponent } from './calculator/calculator.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  activeTheme: string;

  constructor(public dialog: NgbModal,private themeService: ThemeService) {
    this.activeTheme = themeService.current;
  }

  title = 'GL Calculator';

  dialogRef?: NgbModalRef;

  openDialog(): void {
    if(!this.dialogRef){
      this.dialogRef= this.dialog.open(CalculatorComponent, {
        backdrop : 'static',
        keyboard : false
      });

      this.dialogRef?.closed.subscribe((r)=>{
        this.dialogRef=undefined;
      })
    }
  }

  public switchTheme(value:string): void {
    this.themeService.current = value;
    this.activeTheme=value;
  }

}
