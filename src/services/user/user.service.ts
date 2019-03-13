import { Events } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly LOGIN_EVENT = 'com.mellinas.simplenoter.LOGIN_EVENT';
  public readonly LOGOUT_EVENT = 'com.mellinas.simplenoter.LOGOUT_EVENT';
  private hasSession;

  /** @hidden */
  constructor(
    private events: Events
  ) { }

  /**
   * Method that manages the user login flow. It calls firebase services, and check if the user has allowed acces or not
   * @param user Username (maybe an email?)
   * @param pass Password
   * @returns Promise that resolves if session is OK, reject otherwise
   */
  public doLogin(user: string, pass: string): Promise<any> {
    return new Promise( (resolve, reject) => {
      const fireApp = firebase.app();
      fireApp.auth().signInWithEmailAndPassword(user, pass).then( data => {
        this.events.publish(this.LOGIN_EVENT, data);
        resolve(data);
      }).catch( err => {
        reject(err);
      });
    });
  }

  /**
   * Method for logout
   */
  public doLogout(): Promise<void> {
    const fireApp = firebase.app();
    return fireApp.auth().signOut().then( _ => {
      this.events.publish(this.LOGOUT_EVENT);
      return;
    });
  }

  /**
   * Method that returns the current user
   */
  public getCurrentUser() {
    return new Promise((resolve, reject) => {
      const fireApp = firebase.app();
      const unsubscribe = fireApp.auth().onAuthStateChanged( user => {
        unsubscribe();
        resolve(user);
      }, _ => {
        reject();
      });
    });
  }

  public isLogged(): Observable<boolean> {
    return Observable.create( (obs: Observer<boolean>) => {
      const fireApp = firebase.app();
      const unsubscribe = fireApp.auth().onAuthStateChanged( user => {
        unsubscribe();
        obs.next(!!user);
        obs.complete();
      }, _ => {
        obs.next(false);
        obs.complete();
      });
    });
  }
}
