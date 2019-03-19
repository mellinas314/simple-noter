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

  private id: string;

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
        console.log("YA EXISTE!!!");
      }
    });
    window['clientFormPage'] = this;

  }

  public updateData() {
    console.log(this.clientForm.value);
    this.submitAttempt = false;
    if (this.clientForm.valid) {
      this.loadingCtrl.create().then( loader => {
        loader.present();
        if(this.id) {

        }else {
          this.clientS.createClient(this.clientForm.value).then( response => {
            this.clientForm.reset();
            window.history.back();
          }).catch( err => {
            console.warn(err);
          }).then( loader.dismiss );
        }
      });
    } else {
      this.submitAttempt = true;
    }
  }
}

