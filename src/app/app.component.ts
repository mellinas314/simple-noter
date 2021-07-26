import { FIREBASE_CONFIG } from './../../config';
import { Component } from '@angular/core';

import { Events, MenuController } from '@ionic/angular';
import { UserService } from 'src/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router';
import { PrintService } from 'src/services/print/print.service';

window['firebase'] = firebase;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = null;

  public hasSession = false;
  public user = null;

  /** @hidden */
  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    private userService: UserService,
    private events: Events,
    private translate: TranslateService
  ) {
    this.initializeApp();
    this.translate.setDefaultLang('es');
    this.translate.use('es').subscribe( _ => {
      this.initPagesArray();
    });

    this.attachSessionEvents();
    this.manageSessionMenu();
    firebase.firestore().enablePersistence();
    window['mainApp'] = this;
  }

  initializeApp() {
    this.initFirebase();
  }

  private initFirebase(): void {
    firebase.initializeApp(FIREBASE_CONFIG);
  }

  public openLink( link: string ): void {
    window.open(link, '_blank');
  }

  private attachSessionEvents() {
    this.events.subscribe(this.userService.LOGIN_EVENT, _ => {
      this.router.navigate(['home']);
    });

    this.events.subscribe(this.userService.LOGOUT_EVENT, _ => {
      this.router.navigate(['login']);
    });
  }

  private manageSessionMenu() {
    this.events.subscribe(this.userService.LOGIN_EVENT, user => {
      this.hasSession = true;
      this.user = user && user.user;
    });
    this.events.subscribe(this.userService.LOGOUT_EVENT, () => {
      this.hasSession = false;
    });
    this.userService.isLogged().subscribe( isLogged => {
      this.hasSession = isLogged;
    }, _ => {
      this.hasSession = false;
    });
    this.userService.getCurrentUser().then( user => {
      this.user = user;
    });
  }

  public logout() {
    this.menuCtrl.close().then( _ => {
      this.userService.doLogout();
    });
  }

  private initPagesArray() {
    this.appPages = [
      {
        title: this.translate.instant('menu.home'),
        url: '/home',
        icon: 'list'
      },
      {
        title: this.translate.instant('menu.clients'),
        url: '/clients',
        icon: 'people'
      }
    ];
  }
}
