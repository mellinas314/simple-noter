import { FilterComponent } from './../../components/filter/filter.component';
import { ClientCardComponent } from './../../components/client-card/client-card.component';
import { Client } from './../../model/client.model';
import { LoadingController, AlertController, Events, ModalController } from '@ionic/angular';
import { Component } from '@angular/core';
import { TaskService } from 'src/services/task/task.service';
import { TranslateService } from '@ngx-translate/core';
import { Task, TaskType } from 'src/model/task.model';
import { Router } from '@angular/router';
import { OverlayEventDetail } from '@ionic/core';
import { PrintService } from 'src/services/print/print.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public tasks: Task[] = [];
  public loading: boolean;
  public TASK_TYPES_ENUM = TaskType;
  private currentStart;
  private currentEnd;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private translateS: TranslateService,
    private alertCtrl: AlertController,
    private router: Router,
    private events: Events,
    private taskS: TaskService,
    public printS: PrintService
  ) {
    this.printS.configure();
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
    // Por defecto, miramos los últimos 31 días
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
      this.loadingCtrl.create({
        message: 'Cargando...'
      }).then( loader => {
        loader.present();
        client.get().then( (clientInfo: firebase.firestore.DocumentSnapshot) => {
          this.showModalClient(<Client>clientInfo.data(), client.id);
        }).catch( _ => {
          this.router.navigate(['client/' + client.id]);
        }).then( loader.dismiss );
      });
    }
  }

  private showModalClient( clientInfo: Client, clientId: string ): void {
    clientInfo.id = clientId;
    this.modalCtrl.create({
      backdropDismiss: true,
      component: ClientCardComponent,
      animated: true,
      componentProps: {
        cliente: clientInfo
      },
      cssClass: 'floating-modal',
      showBackdrop: true
    }).then( modal => {
      modal.present();
    });
  }

  public editTask( task ) {
    this.router.navigate(['task/' + task.id]);
  }

  public printTask( task ) {
    this.printS.printTask(task);
  }

  public async filter() {
    const modal = await this.modalCtrl.create({
      backdropDismiss: true,
      component: FilterComponent,
      animated: true,
      componentProps: {
        date: true,
        client: true,
        type: true,
        paid_pending: true
      },
      cssClass: ['floating-modal', 'bottom-modal']
    });
    modal.present();
    modal.onDidDismiss().then( (event: OverlayEventDetail) => {
      if (event.data) {
        this.doFilter(event.data);
      }
    });
  }

  private async doFilter( data: {client ?: string, end ?: string, start ?: string, type ?: string, pending_paid ?: string} ) {
    //console.log('Filter', data);
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.taskS.getTasksFiltered(new Date(data.start).getTime(), new Date(data.end).getTime(), data.client, data.type, data.pending_paid).then( tareas => {
      this.tasks = tareas;
    }).catch( e => {
      this.alertCtrl.create({
        buttons: [this.translateS.instant('shared.close')],
        message: this.translateS.instant('shared.error')
      }).then( alert => alert.present() );
    }).then( loader.dismiss );
  }

  ionViewWillEnter() {
    window['isHome'] = true;
  }

  ionViewWillLeave() {
    window['isHome'] = false;
  }

}
