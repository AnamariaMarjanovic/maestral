import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, email, form, minLength, required } from '@angular/forms/signals';
import { MsField, provideMsErrorMessages } from 'maestral/field';
import { MsInput } from './input';

@Component({
  imports: [FormField, MsField, MsInput],
  template: `
    <ms-field id="name" label="Full name">
      <input msInput [formField]="contactForm.name" />
    </ms-field>
    <ms-field id="email" label="Email">
      <input msInput type="email" [formField]="contactForm.email" />
    </ms-field>
    <ms-field id="message" label="Message">
      <textarea msInput [formField]="contactForm.message"></textarea>
    </ms-field>
    <ms-field id="topic" label="Topic">
      <select msInput [formField]="contactForm.topic">
        <option value="">Choose a topic</option>
        <option value="bug">Bug report</option>
      </select>
    </ms-field>
    <input msInput id="standalone" aria-label="Standalone" />
  `,
})
class Host {
  readonly model = signal({ name: '', email: '', message: '', topic: '' });
  readonly contactForm = form(this.model, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email);
    email(path.email);
    minLength(path.message, 10);
    required(path.topic, { message: 'Choose a topic' });
  });
}

describe('MsInput', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const field = (id: string) => {
      const host = root.querySelector<HTMLElement>(`#${id}`)!;
      return {
        label: host.querySelector('label')!,
        control: host.querySelector<HTMLInputElement>('.ms-input')!,
        select: host.querySelector<HTMLSelectElement>('select'),
        error: () => host.querySelector('.ms-field__error')?.textContent?.replace('Error: ', '').trim() ?? null,
      };
    };
    const type = async (control: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      control.value = value;
      control.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    const blur = async (control: HTMLElement) => {
      control.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    return { fixture, root, field, type, blur };
  }

  it('styles a native input outside a field without ARIA state', async () => {
    const { root } = await setup();
    const input = root.querySelector<HTMLInputElement>('#standalone')!;
    expect(input.classList).toContain('ms-input');
    expect(input.hasAttribute('aria-invalid')).toBe(false);
  });

  describe('with Signal Forms', () => {
    it('takes required from the schema', async () => {
      const { field } = await setup();
      expect(field('name').control.getAttribute('aria-required')).toBe('true');
      expect(field('name').label.querySelector('.ms-field__required')).not.toBeNull();
      expect(field('message').control.hasAttribute('aria-required')).toBe(false);
    });

    it('does not show errors while the user is still typing', async () => {
      const { field, type } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      expect(error()).toBeNull();
      expect(control.hasAttribute('aria-invalid')).toBe(false);
    });

    it('shows the error once the user leaves the field', async () => {
      const { field, type, blur } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      await blur(control);
      expect(error()).toBe('Enter an email address in the correct format, like name@example.com');
      expect(control.getAttribute('aria-invalid')).toBe('true');
    });

    it('prefers the message from the schema', async () => {
      const { field, blur } = await setup();
      const { control, error } = field('name');
      await blur(control);
      expect(error()).toBe('Enter your full name');
    });

    it('removes the error as soon as the value is valid', async () => {
      const { field, type, blur } = await setup();
      const { control, error } = field('email');
      await type(control, 'ana@');
      await blur(control);
      await type(control, 'ana@example.com');
      expect(error()).toBeNull();
      expect(control.hasAttribute('aria-invalid')).toBe(false);
    });

    it('shows one error at a time', async () => {
      const { root, field, blur } = await setup();
      await blur(field('email').control);
      expect(root.querySelectorAll('#email .ms-field__error')).toHaveLength(1);
      expect(field('email').error()).toBe('This field is required');
    });
  });

  describe('on a select', () => {
    it('is labelled, validated and cleared like any other control', async () => {
      const { fixture, field, blur } = await setup();
      const topic = field('topic');
      expect(topic.select!.classList).toContain('ms-input');
      expect(topic.label.htmlFor).toBe(topic.select!.id);
      expect(topic.select!.getAttribute('aria-required')).toBe('true');

      await blur(topic.select!);
      expect(topic.error()).toBe('Choose a topic');
      expect(topic.select!.getAttribute('aria-invalid')).toBe('true');

      // Browsers fire both events when an option is picked
      topic.select!.value = 'bug';
      topic.select!.dispatchEvent(new Event('input'));
      topic.select!.dispatchEvent(new Event('change'));
      await fixture.whenStable();
      expect(topic.error()).toBeNull();
    });
  });

  describe('with custom messages', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [provideMsErrorMessages({ required: () => 'Polje je obavezno' })],
      });
    });

    it('uses the provided message and keeps the other defaults', async () => {
      const { field, type, blur } = await setup();
      await blur(field('email').control);
      expect(field('email').error()).toBe('Polje je obavezno');

      await type(field('message').control, 'short');
      await blur(field('message').control);
      expect(field('message').error()).toBe('Enter at least 10 characters');
    });
  });
});
