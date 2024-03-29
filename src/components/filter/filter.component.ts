import { TaskType } from 'src/model/task.model';
import { ModalController } from '@ionic/angular';
import { Client } from 'src/model/client.model';
import { Component, OnInit, Input } from '@angular/core';
import { ClientService } from 'src/services/client/client.service';

const MONTH_MILLISECONDS = 60 * 60 * 24 * 31 * 1000;

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  @Input() public client: boolean;
  @Input() public date: boolean;
  @Input() public name: boolean;
  @Input() public type: boolean;
  @Input() public paid_pending: boolean;
  public TASK_TYPES: string[] = ( types => {
    const result = [];
    for (let i = 0; types[i]; i++) {
      result.push(types[i]);
    }
    return result;
  })(TaskType);
  public clients: Client[];
  public selectedClient: Client;
  public selectedType: TaskType;
  public selectedPaid: string;

  public dateEnd = new Date().toISOString();
  public dateStart = new Date(Date.now() - MONTH_MILLISECONDS).toISOString();

  constructor(
    private modalCtrl: ModalController,
    private clientS: ClientService
  ) {
    window['filterC'] = this;
 }

  ngOnInit() {
    this.clientS.getAllClients().then( clients => {
      this.clients = clients;
    });
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  save() {
    this.modalCtrl.dismiss({
      client: this.selectedClient,
      start: this.dateStart,
      end: this.dateEnd,
      type: this.selectedType,
      pending_paid: this.selectedPaid
    });
  }
}
