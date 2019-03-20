import { LoadingController, AlertController, Events } from '@ionic/angular';
import { Component } from '@angular/core';
import { TaskService } from 'src/services/task/task.service';
import { TranslateService } from '@ngx-translate/core';
import { Task } from 'src/model/task.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public tasks: Task[] = [];
  public loading: boolean;
  private currentStart;
  private currentEnd;

  constructor(
    private loadingCtrl: LoadingController,
    private translateS: TranslateService,
    private alertCtrl: AlertController,
    private router: Router,
    private events: Events,
    private taskS: TaskService
  ) {
    this.events.subscribe( this.taskS.TASK_UPDATED_EVENT, _ => this.refreshTasks(this.currentStart, this.currentEnd));
    this.events.subscribe( this.taskS.TASK_NEW_EVENT, _ => this.refreshTasks());
    this.refreshTasks();
    window['homeP'] = this;
  }

  private async refreshTasks(startDate = this.getStartDate(), endDate = Date.now()) {
    this.currentEnd = endDate;
    this.currentStart = startDate;
    this.loading = true;
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.taskS.getTasks(startDate, endDate).then( tareas => {
      this.tasks = tareas;
      this.loading = false;
    }, _ => {
      this.loading = false;
      this.alertCtrl.create({
        message: this.translateS.instant('client.list.error_downloading'),
        buttons: [this.translateS.instant('shared.close')]
      });
    }).then( loader.dismiss );
  }

  private getStartDate():number {
    //Por defecto, miramos los últimos 31 días
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    const diff = 31 * 24 * 60 * 60 * 1000;
    return today.getTime() - diff;
  }

  public openClient( client: firebase.firestore.DocumentReference ) {
    if (client && typeof client === 'string') {
      this.router.navigate(['client/' + client]);
    } else {
      this.router.navigate(['client/' + client.id]);
    }
  }

  public editTask( task ) {
    this.router.navigate(['task/' + task.id]);
  }

}
