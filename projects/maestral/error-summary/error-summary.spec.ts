import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, email, form, required, submit } from '@angular/forms/signals';
import { MsField } from 'maestral/field';
import { MsInput } from 'maestral/input';
import { MsErrorSummary } from './error-summary';

@Component({
  imports: [FormField, MsErrorSummary, MsField, MsInput],
  template: `
    <form novalidate (submit)="onSubmit($event)">
      <ms-error-summary [form]="contactForm" />
      <ms-field label="Full name">
        <input msInput id="name" [formField]="contactForm.name" />
      </ms-field>
      <ms-field label="Email">
        <input msInput id="email" type="email" [formField]="contactForm.email" />
      </ms-field>
      <button type="submit">Send</button>
    </form>
  `,
})
class Host {
  readonly model = signal({ name: '', email: '' });
  readonly contactForm = form(this.model, (path) => {
    required(path.name, { message: 'Enter your full name' });
    required(path.email);
    email(path.email);
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.contactForm, async () => {});
  }
}

describe('MsErrorSummary', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const summary = () => root.querySelector<HTMLElement>('.ms-error-summary');
    const links = () => Array.from(root.querySelectorAll<HTMLAnchorElement>('.ms-error-summary__link'));
    const submitForm = async () => {
      root.querySelector('form')!.requestSubmit();
      await fixture.whenStable();
    };
    const type = async (id: string, value: string) => {
      const input = root.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
      await fixture.whenStable();
    };
    return { fixture, root, summary, links, submitForm, type };
  }

  // jsdom does not implement scrolling, so record the calls instead.
  let scrolled: Element[];

  beforeEach(() => {
    scrolled = [];
    Element.prototype.scrollIntoView = function (this: Element) {
      scrolled.push(this);
    };
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders nothing before the first submit attempt', async () => {
    const { summary } = await setup();
    expect(summary()).toBeNull();
  });

  it('lists each invalid field after a submit attempt', async () => {
    const { summary, links, submitForm } = await setup();
    await submitForm();

    expect(summary()?.querySelector('h2')?.textContent).toBe('There is a problem');
    expect(links().map((link) => link.textContent?.trim())).toEqual([
      'Enter your full name',
      'This field is required',
    ]);
    expect(links().map((link) => link.getAttribute('href'))).toEqual(['#name', '#email']);
  });

  it('is labelled by its heading', async () => {
    const { summary, submitForm } = await setup();
    await submitForm();
    const heading = summary()!.querySelector('h2')!;
    expect(summary()!.getAttribute('aria-labelledby')).toBe(heading.id);
  });

  it('moves focus to the summary', async () => {
    const { summary, submitForm } = await setup();
    await submitForm();
    expect(document.activeElement).toBe(summary());
  });

  it('focuses the field when a link is activated', async () => {
    const { root, links, submitForm } = await setup();
    await submitForm();
    links()[1].click();
    expect(document.activeElement).toBe(root.querySelector('#email'));
  });

  it('scrolls the whole field into view so its label is visible', async () => {
    const { root, links, submitForm } = await setup();
    await submitForm();
    links()[1].click();
    expect(scrolled).toEqual([root.querySelector('#email')!.closest('ms-field')]);
  });

  it('updates as fields are fixed and hides when none are left', async () => {
    const { summary, links, submitForm, type } = await setup();
    await submitForm();

    await type('name', 'Anamaria');
    expect(links()).toHaveLength(1);

    await type('email', 'ana@example.com');
    expect(summary()).toBeNull();
  });
});
