import { Component } from '@angular/core';
import { MsButton } from 'maestral/button';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';

@Component({
  selector: 'app-root',
  imports: [MsButton, MsField, MsInput],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }