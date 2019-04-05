import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundedLetterComponent } from './rounded-letter/rounded-letter.component';
import { ClientCardComponent } from './client-card/client-card.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    RoundedLetterComponent,
    ClientCardComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule
  ],
  exports: [
    RoundedLetterComponent,
    ClientCardComponent
  ]
})
export class ComponentsModule { }
