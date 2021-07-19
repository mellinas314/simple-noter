import { AlertController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { AlertButton } from '@ionic/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /** @hidden */
  constructor(
    private alertCtrl: AlertController
  ) { }

  /**
   * Method that print and returns an alert
   * @param content Message alert content
   * @param buttons Buttons
   * @param title Alert title. Optional
   * @param subtitle Alert subtitle. Optional
   */
  public showAlert(content: string, buttons: AlertButton[], title: string = '', subtitle: string = '' ): Promise<HTMLIonAlertElement> {
    return this.alertCtrl.create({
      message: content,
      buttons: buttons,
      header: title,
      subHeader: subtitle
    }).then( alert => {
      alert.present();
      return alert;
    });
  }
}
