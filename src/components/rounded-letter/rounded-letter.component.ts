import { Component, OnInit, Input } from '@angular/core';

/**
 * Simplo component that renders the letter passed as parameter in a rounded circle (like gmail contacts)
 * You can pass a color and border color, but the only mandatory input is the letter and font size
 */
@Component({
  selector: 'app-rounded-letter',
  templateUrl: './rounded-letter.component.html',
  styleUrls: ['./rounded-letter.component.scss'],
})
export class RoundedLetterComponent implements OnInit {

  @Input() letter: string;
  @Input() fontSize: string;
  @Input() color: string;
  @Input() borderColor: string;

  constructor() { }

  ngOnInit() {}

}
