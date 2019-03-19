import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage {

  constructor(
    private router: Router
  ) { }

  public createClient() {
    this.router.navigate(['client']);
  }
}
