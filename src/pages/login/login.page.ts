import { UserService } from './../../services/user/user.service';
import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/services/utils/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  public username: string;
  public pass: string;

  /** @hidden */
  constructor(
    /** @hidden */ private userS: UserService,
    /** @hidden */ private translateS: TranslateService,
    /** @hidden */ private utilsS: UtilsService,
    /** @hidden */ private alertCtrl: AlertController,
    /** @hidden */ private loadingCtrl: LoadingController
  ) { }

  public async doLogin() {
    if(!this.username || !this.pass || !this.username.trim() || !this.pass.trim()) {
      this.utilsS.showAlert(this.translateS.instant('login.error_fields'), [this.translateS.instant('shared.close')]);
      return;
    }
    const loader = await this.loadingCtrl.create();
    loader.present();
    this.userS.doLogin(this.username, this.pass).then( _ => {
      loader.dismiss();
    }, _ => {
      loader.dismiss();
      this.utilsS.showAlert(this.translateS.instant('login.error_login_in'), [this.translateS.instant('shared.close')]);
    });
  }

  public openLink( url: string ): void {
    window.open(url, '_blank');
  }

}
