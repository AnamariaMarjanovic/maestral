import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { MsRadio } from 'maestral/choice';
import { MsFieldset } from 'maestral/field';
import { MsErrorSummary } from './error-summary';

@Component({
  imports: [FormField, MsErrorSummary, MsFieldset, MsRadio],
  template: `
    <form novalidate (submit)="onSubmit($event)">
      <ms-error-summary [form]="signupForm" />
      <ms-fieldset legend="Plan">
        <label><input type="radio" msRadio value="free" [formField]="signupForm.plan" /> Free</label>
        <label><input type="radio" msRadio value="pro" [formField]="signupForm.plan" /> Pro</label>
      </ms-fieldset>
    </form>
  `,
})
class Host {
  readonly model = signal({ plan: '' });
  readonly signupForm = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a plan' });
  });

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.signupForm, async () => {});
  }
}

describe('MsErrorSummary with groups', () => {
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

  it('links a radio group to its first option and scrolls to the legend', async () => {
    const fixture = TestBed.createComponent(Host);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;

    root.querySelector('form')!.requestSubmit();
    await fixture.whenStable();

    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.ms-error-summary__link'));
    expect(links.map((link) => link.textContent?.trim())).toEqual(['Choose a plan']);
    // Radio buttons get generated ids, so the link has a target
    const firstRadio = root.querySelector<HTMLInputElement>('input[value=free]')!;
    expect(firstRadio.id).toBeTruthy();
    expect(links[0].getAttribute('href')).toBe('#' + firstRadio.id);

    links[0].click();
    expect(document.activeElement).toBe(firstRadio);
    expect(scrolled).toEqual([root.querySelector('ms-fieldset')]);
  });
});
