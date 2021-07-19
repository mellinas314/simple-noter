import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundedLetterComponent } from './rounded-letter/rounded-letter.component';
import { ClientCardComponent } from './client-card/client-card.component';
import { IonicModule } from '@ionic/angular';
import { FilterComponent } from './filter/filter.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RoundedLetterComponent,
    ClientCardComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule
  ],
  exports: [
    RoundedLetterComponent,
    ClientCardComponent,
    FilterComponent
  ]
})
export class ComponentsModule { }
