import { ClientService } from './../../services/client/client.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client',
  templateUrl: './client.page.html',
  styleUrls: ['./client.page.scss'],
})
export class ClientPage {

  public clientForm: FormGroup;
  public submitAttempt = false;

  public id: string;
  public initializing = true;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private translateS: TranslateService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private clientS: ClientService
  ) {
    this.clientForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')],
      phone: ['', Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$')]
    });

    this.route.params.subscribe( params => {
      this.id = params.id;
      if(this.id) {
        this.syncClientInfo();
      }
      this.initializing = false;
    });
    window['clientFormPage'] = this;
  }

  private async syncClientInfo() {
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.clientS.getClient(this.id).then( client => {
      this.clientForm.setValue( {
        name: client.name,
        email: client.email,
        phone: client.phone
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

  private updateSuccess() {
    this.clientForm.reset();
    window.history.back();
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
    if (this.clientForm.valid) {
      this.loadingCtrl.create().then( loader => {
        loader.present();
        if(this.id) {
          this.clientS.updateClient( this.clientForm.value, this.id )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => this.updateError() )
                      .then( loader.dismiss );
        } else {
          this.clientS.createClient( this.clientForm.value )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => this.updateError() )
                      .then( loader.dismiss );
        }
      });
    } else {
      this.submitAttempt = true;
    }
  }

  public deleteClient() {
    this.alertCtrl.create({
      message: this.translateS.instant('client.alert.confirm_delete'),
      buttons: [{
        text: this.translateS.instant('shared.cancel')
      }, {
        role: 'cancel',
        text: this.translateS.instant('shared.confirm'),
        handler: async _ => {
          const loader = await this.loadingCtrl.create();
          loader.present();
          this.clientS.deleteClient( this.id )
                      .then( _ => this.updateSuccess() )
                      .catch( _ => {
                        this.alertCtrl.create({
                          message: this.translateS.instant('client.alert.error_delete'),
                          buttons: [this.translateS.instant('shared.close')]
                        }).then( popup => popup.present() );
                      }).then( loader.dismiss );
        }
      }]
    }).then( alert => {
      alert.present();
    });
  }
}

