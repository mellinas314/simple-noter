import { Client } from 'src/model/client.model';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrls: ['./client-card.component.scss'],
})
export class ClientCardComponent {

  constructor(
    private router: Router
  ) {}

  @Input() cliente: Client;

  public doCall( cliente: Client ): void {
    window.open('tel:' + cliente.phone, '_blank');
  }

  public editClient( cliente: Client ): void {
    this.router.navigate(['client/' + cliente.id]);
  }

  public sendMail( cliente: Client ): void {
    window.open('mailto:' + cliente.email);
  }


}
