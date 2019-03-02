import { Component } from '@angular/core';

import { Platform, Events } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserService } from 'src/services/user/user.service';
import { TranslateService } from '@ngx-translate/core';

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
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public openLink( link: string ): void {
    window.open(link, '_blank');
  }
}
