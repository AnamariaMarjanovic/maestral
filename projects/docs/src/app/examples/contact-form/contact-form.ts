import { Component, signal } from '@angular/core';
import { FormField, email, form, minLength, required, submit } from '@angular/forms/signals';
import { MsButton } from 'maestral/button';
import { MsCheckbox, MsChoice, MsRadio } from 'maestral/choice';
import { MsErrorSummary } from 'maestral/error-summary';
import { MsField, MsFieldset } from 'maestral/field';
import { MsInput } from 'maestral/input';

interface ContactModel {
  name: string;
  email: string;
  topic: string;
  reply: string;
  message: string;
  privacy: boolean;
}

/** The complete form example: every control, validation and the error summary. */
@Component({
  selector: 'docs-contact-form',
  imports: [
    FormField,
    MsButton,
    MsCheckbox,
    MsChoice,
    MsErrorSummary,
    MsField,
    MsFieldset,
    MsInput,
    MsRadio,
  ],
  templateUrl: './contact-form.html',
})
export class ContactForm {
  protected readonly topics = [
    { value: 'question', label: 'A question about Maestral' },
    { value: 'bug', label: 'Something does not work' },
    { value: 'idea', label: 'An idea for a component' },
  ];

  protected readonly replyOptions = [
    { value: 'email', label: 'By email' },
    { value: 'none', label: 'No reply needed' },
  ];

  protected readonly contact = signal<ContactModel>({
    name: '',
    email: '',
    topic: '',
    reply: '',
    message: '',
    privacy: false,
  });

  protected readonly contactForm = form(this.contact, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email, { message: 'Enter your email address' });
    email(path.email);
    required(path.topic, { message: 'Choose what your message is about' });
    required(path.reply, { message: 'Choose whether you want a reply' });
    minLength(path.message, 10);
    required(path.privacy, { message: 'Agree to the privacy notice to send your message' });
  });

  protected readonly sent = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.contactForm, async () => {
      this.sent.set(true);
    });
  }
}
