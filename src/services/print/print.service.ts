import { Injectable } from '@angular/core';
import { IS_PRINT_DEBUG } from 'config';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  public showPrintIcon : boolean = false;

  public configure() {
    console.log("Configure!!!", document.body.hasAttribute('data-is-ticketer-app'));
    this.showPrintIcon = IS_PRINT_DEBUG || document.body.hasAttribute('data-is-ticketer-app');
    window['printService'] = this;
  }

  public printTask(task: any) {
    console.log("Print task: ", task);
  }
}
