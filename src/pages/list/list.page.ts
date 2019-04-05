import { Client } from './../../model/client.model';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from './../../services/client/client.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {

  public clientes: Client[] = [];
  public loading = true;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,
    private translateS: TranslateService,
    private alertCtrl: AlertController,
    private clientS: ClientService
  ) { }

  public createClient() {
    this.router.navigate(['client']);
  }

  ionViewWillEnter() {
    this.refreshClients();
  }

  async refreshClients() {
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.clientS.getAllClients().then( clientes => {
      this.clientes = clientes;
      this.loading = false;
    }).catch( err => {
      this.loading = false;
      this.alertCtrl.create({
        message: this.translateS.instant('client.list.error_downloading'),
        buttons: [this.translateS.instant('shared.close')]
      });
    }).then( loader.dismiss );
  }
}
