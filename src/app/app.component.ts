import { FIREBASE_CONFIG } from './../../config';
import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from 'src/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Router } from '@angular/router';

window['firebase'] = firebase;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  public hasSession = false;

  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private userService: UserService,
    private events: Events,
    private translate: TranslateService
  ) {
    this.initializeApp();
    this.events.subscribe(this.userService.LOGIN_EVENT, () => {
      this.hasSession = true;
    });
    this.events.subscribe(this.userService.LOGOUT_EVENT, () => {
      this.hasSession = false;
    });
    this.translate.setDefaultLang('es');
    this.translate.use('es');

    this.attachSessionEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

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
}
