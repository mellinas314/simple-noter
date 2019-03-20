import { Events } from '@ionic/angular';
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

  public readonly TASK_NEW_EVENT = 'taskservice.tasknewevent';
  public readonly TASK_UPDATED_EVENT = 'taskservice.taskupdatedevent';

  constructor(
    private clientS: ClientService,
    private events: Events
  ) {
    this.db = firebase.firestore();
  }

  public updateTask( task: Task, id: string): Promise<any> {
    return new Promise( (resolve, reject) => {
      const syncTask: Task = {
        client: task.client ? this.clientS.getDocReference(task.client) : null,
        clientDescriptionName: task.clientDescriptionName,
        date: task.date,
        description: task.description,
        title: task.title,
        total: task.total
      };
      this.db.collection(this.COLLECTION_NAME).doc(id).set(syncTask).then( res => {
        resolve(res);
        this.events.publish(this.TASK_UPDATED_EVENT);
      } ).catch( reject );
    });
  }

  public getTask( id: string ): Promise<Task> {
    return new Promise<Task>( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME).doc(id).get().then( data => {
        if (data && data.data()) {
          const tmpTask = <Task>data.data();
          tmpTask.id = data.id;
          resolve(tmpTask);
        } else {
          reject();
        }
      }, reject );
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

      this.db.collection(this.COLLECTION_NAME).add(syncTask).then( res => {
        resolve(res);
        this.events.publish(this.TASK_NEW_EVENT);
       } ).catch( reject );
    });
  }

  public deleteTask( taskId: string ): Promise<any> {
    return new Promise( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME).doc(taskId).delete().then( res => {
        this.events.publish(this.TASK_NEW_EVENT);
        resolve(res);
      } ).catch( reject );
    });
  }

  public getTasks( start: number = 0, end: number = Date.now() ): Promise<Task[]> {
    return new Promise<Task[]>( (resolve, reject) => {
      this.db.collection(this.COLLECTION_NAME)
              .where( 'date', '>=', start)
              .where( 'date', '<=', end)
              .orderBy('date', 'desc')
              .get().then( entries => {
                const tasks:Task[] = [];
                entries.docs.forEach( client => {
                  const tmpTask = <Task>client.data();
                  tmpTask.id = client.id;
                  tasks.push(tmpTask);
                });
                resolve(tasks);
      }).catch( reject );
    });
  }
}
