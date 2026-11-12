import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, submit } from '@angular/forms/signals';
import { MsButton } from 'maestral/button';
import { MsErrorSummary } from 'maestral/error-summary';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';

interface ContactModel {
  name: string;
  email: string;
  message: string;
}

/** The complete form example: fields, validation and error summary. */
@Component({
  selector: 'docs-contact-form',
  imports: [FormField, MsButton, MsErrorSummary, MsField, MsInput],
  templateUrl: './contact-form.html',
})
export class ContactForm {
  protected readonly contact = signal<ContactModel>({ name: '', email: '', message: '' });

  protected readonly contactForm = form(this.contact, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email, { message: 'Enter your email address' });
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
