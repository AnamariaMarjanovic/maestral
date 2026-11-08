import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, submit } from '@angular/forms/signals';
import { MsButton } from 'maestral/button';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';

interface ContactModel {
  name: string;
  email: string;
  message: string;
}

@Component({
  selector: 'app-root',
  imports: [FormField, MsButton, MsField, MsInput],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly contact = signal<ContactModel>({ name: '', email: '', message: '' });

  protected readonly contactForm = form(this.contact, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email);
    email(path.email);
    minLength(path.message, 10);
  });

  protected readonly sent = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.contactForm, async () => {
      this.sent.set(true);
    });
  }
}
