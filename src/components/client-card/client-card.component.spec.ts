import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCardPage } from './client-card.page';

describe('ClientCardPage', () => {
  let component: ClientCardPage;
  let fixture: ComponentFixture<ClientCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
