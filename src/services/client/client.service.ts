import { Client } from './../../model/client.model';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private db: firebase.firestore.Firestore;
  private readonly COLLECTION_NAME = "client";

  constructor() {
    this.db = firebase.firestore();
  }

  public createClient( client: Client ): Promise<any> {
    return new Promise( (resolve, reject) => {
      const syncClient: Client = {
        name: client.name,
        email: client.email,
        phone: client.phone
      };

      this.db.collection(this.COLLECTION_NAME).add(syncClient).then( resolve ).catch( reject );
    });
  }

  public getClient( id: string ): Promise<Client> {
    return new Promise<Client>( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME).doc(id).get().then( data => {
        if (data && data.data()) {
          const tmpClient = <Client>data.data();
          tmpClient.id = data.id;
          resolve(tmpClient);
        } else {
          reject();
        }
      }, reject );
    });
  }

  public updateClient( client: Client, id: string ): Promise<any> {
    return new Promise( (resolve, reject) => {
      const syncClient: Client = {
        name: client.name,
        email: client.email,
        phone: client.phone
      };
      this.db.collection(this.COLLECTION_NAME).doc(id).set(syncClient).then( resolve ).catch( reject );
    });
  }

  public deleteClient( clientId: string ): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME).doc(clientId).delete().then( resolve ).catch( reject );
    });
  }

  public getAllClients(): Promise<Client[]> {
    return new Promise( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME).orderBy('name').get().then( data => {
        const clients: Client[] = [];
        data.docs.forEach( client => {
          const tmpClient = <Client>client.data();
          tmpClient.id = client.id;
          clients.push(tmpClient);
        });
        resolve(clients);
      }).catch( reject );
    });
  }

  public getDocReference( id ): firebase.firestore.DocumentReference {
    return this.db.doc((this.COLLECTION_NAME + '/' + id));
  }
}

