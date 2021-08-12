import { Injectable } from '@angular/core';
import { IS_PRINT_DEBUG } from 'config';
import { Task } from 'src/model/task.model';

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

  public printTask(task: Task, id: string = "") {
    if(window["NativePrint"]) {
      (window as any).NativePrint.printTask(JSON.stringify({
        title: task.title,
        description: task.description,
        id: task.id || id,
        clientName: task.clientDescriptionName,
        total: task.total,
        date: task.date,
        type: task.type
      }));
    }
  }
}
