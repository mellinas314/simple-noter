import { ClientService } from 'src/services/client/client.service';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { Task } from 'src/model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private db: firebase.firestore.Firestore;
  private readonly COLLECTION_NAME = 'task';

  constructor(
    private clientS: ClientService
  ) {
    this.db = firebase.firestore();
  }

  public updateTask( task: Task, id: string): Promise<any> {
    return new Promise( (resolve, reject) => {

    });
  }

  public createTask( task: Task ): Promise<any> {
    return new Promise( (resolve, reject) => {
      const syncTask: Task = {
        client: task.client ? this.clientS.getDocReference(task.client) : null,
        clientDescriptionName: task.clientDescriptionName,
        date: task.date,
        description: task.description,
        title: task.title,
        total: task.total
      };

      this.db.collection(this.COLLECTION_NAME).add(syncTask).then( resolve ).catch( reject );
    });
  }
}
