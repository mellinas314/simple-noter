import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { ClientService } from 'src/services/client/client.service';
import { Client } from 'src/model/client.model';
import { TaskService } from 'src/services/task/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
})
export class TaskPage {

  public taskForm: FormGroup;
  public submitAttempt = false;

  public clients: Client[];
  public id: string;
  public initializing = true;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private translateS: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private clientS: ClientService,
    private taskS: TaskService
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      client: [''],
      clientDescriptionName: [''],
      total: ['', [Validators.required, Validators.min(0), Validators.max(5000)]],
      date: ['']
    });

    this.route.params.subscribe( params => {
      this.id = params.id;
      if (this.id) {
        this.syncTaskInfo();
      }
      this.initializing = false;
    });
    this.clientS.getAllClients().then( clients => {
      this.clients = clients;
    });
    this.taskForm.patchValue({
      date: Date.now()
    });
    window['taskFormPage'] = this;
  }

  private async syncTaskInfo() {
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.taskS.getTask(this.id).then( task => {
      this.taskForm.setValue( {
        title: task.title,
        description: task.description,
        client: !task.client ||  typeof task.client === 'string' ? task.client : task.client.id,
        clientDescriptionName: task.clientDescriptionName,
        total: task.total,
        date: task.date
      });
    }).catch( err => {
      console.warn(err);
      this.alertCtrl.create({
        message: this.translateS.instant('client.alert.error_fetching_info'),
        buttons: [this.translateS.instant('shared.close')]
      });
      window.history.back();
    }).then( loader.dismiss );
  }

  public deleteTask() {
    this.alertCtrl.create({
      message: this.translateS.instant('task.alert.confirm_delete'),
      buttons: [{
        text: this.translateS.instant('shared.cancel')
      }, {
        role: 'cancel',
        text: this.translateS.instant('shared.confirm'),
        handler: async _ => {
          const loader = await this.loadingCtrl.create();
          loader.present();
          this.taskS.deleteTask( this.id )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => {
                        this.alertCtrl.create({
                          message: this.translateS.instant('task.alert.error_delete'),
                          buttons: [this.translateS.instant('shared.close')]
                        }).then( popup => popup.present() );
                      }).then( loader.dismiss );
        }
      }]
    }).then( alert => {
      alert.present();
    });
  }

  private updateSuccess() {
    window.history.back();
    this.taskForm.reset();
  }

  private updateError() {
    this.alertCtrl.create({
      message: this.translateS.instant('client.alert.error_creating'),
      buttons: [this.translateS.instant('shared.close')]
    }).then( alert => {
      alert.present();
    });
  }

  public updateData() {
    this.submitAttempt = false;
    if (this.taskForm.valid) {
      this.loadingCtrl.create().then( loader => {
        loader.present();
        if (this.id) {
          this.taskS.updateTask( this.taskForm.value, this.id )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => this.updateError() )
                      .then( loader.dismiss );
        } else {
          this.taskS.createTask( this.taskForm.value )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => this.updateError() )
                      .then( loader.dismiss );
        }
      });
    } else {
      this.submitAttempt = true;
    }
  }

  public onChangeClient( client: CustomEvent ) {
    const id = client.detail.value;
    for(let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].id === id) {
        this.taskForm.patchValue({
          clientDescriptionName: this.clients[i].name
        });
        return;
      }
    }
  }
}
