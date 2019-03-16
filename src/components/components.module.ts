import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundedLetterComponent } from './rounded-letter/rounded-letter.component';

@NgModule({
  declarations: [
    RoundedLetterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RoundedLetterComponent
  ]
})
export class ComponentsModule { }
