import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, required } from '@angular/forms/signals';
import { MsFieldset } from 'maestral/field';
import { MsCheckbox, MsChoice, MsRadio } from './choice';

@Component({
  imports: [FormField, MsFieldset, MsCheckbox, MsChoice, MsRadio],
  template: `
    <ms-fieldset id="plan" legend="Plan" hint="You can change it later.">
      @for (option of plans; track option) {
        <label msChoice>
          <input type="radio" msRadio [value]="option" [formField]="signup.plan" />
          {{ option }}
        </label>
      }
    </ms-fieldset>

    <ms-fieldset id="terms" legend="Terms">
      <label msChoice>
        <input type="checkbox" msCheckbox [formField]="signup.terms" />
        I accept the terms
      </label>
    </ms-fieldset>

    <label msChoice id="standalone">
      <input type="checkbox" msCheckbox />
      Remember me
    </label>
  `,
})
class Host {
  readonly plans = ['Free', 'Pro'];
  readonly model = signal({ plan: '', terms: false });
  readonly signup = form(this.model, (path) => {
    required(path.plan, { message: 'Choose a plan' });
    required(path.terms, { message: 'Accept the terms to continue' });
  });
}

describe('MsCheckbox and MsRadio', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const group = (id: string) => {
      const host = root.querySelector<HTMLElement>(`#${id}`)!;
      return {
        host,
        fieldset: host.querySelector('fieldset')!,
        legend: host.querySelector('legend')!,
        controls: Array.from(host.querySelectorAll<HTMLInputElement>('input')),
        error: () => host.querySelector('.ms-field__error')?.textContent?.replace('Error: ', '').trim() ?? null,
      };
    };
    const blur = async (input: HTMLElement) => {
      input.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const click = async (input: HTMLElement) => {
      input.click();
      await fixture.whenStable();
    };
    return { fixture, root, group, blur, click };
  }

  it('styles native controls and keeps them native', async () => {
    const { root, group } = await setup();
    expect(group('plan').controls.every((input) => input.type === 'radio')).toBe(true);
    expect(group('plan').controls[0].classList).toContain('ms-radio');
    expect(root.querySelector('#standalone input')!.classList).toContain('ms-checkbox');
    expect(root.querySelector('#standalone')!.classList).toContain('ms-choice');
  });

  it('gives every control a unique id', async () => {
    const { root } = await setup();
    const ids = Array.from(root.querySelectorAll('input'), (input) => input.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('groups radio buttons under a legend described by the hint', async () => {
    const { group } = await setup();
    const { fieldset, legend } = group('plan');
    expect(legend.textContent).toContain('Plan');
    const hint = fieldset.querySelector('.ms-field__hint')!;
    expect(fieldset.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('takes required from the schema', async () => {
    const { group } = await setup();
    expect(group('plan').legend.querySelector('.ms-field__required')).not.toBeNull();
  });

  it('shows the group error once the user leaves the group', async () => {
    const { group, blur } = await setup();
    const plan = group('plan');
    expect(plan.error()).toBeNull();

    await blur(plan.controls[0]);
    expect(plan.error()).toBe('Choose a plan');
    expect(plan.controls.every((input) => input.getAttribute('aria-invalid') === 'true')).toBe(true);

    const error = plan.fieldset.querySelector('.ms-field__error')!;
    expect(plan.fieldset.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('clears the error when an option is chosen', async () => {
    const { group, blur, click } = await setup();
    const plan = group('plan');
    await blur(plan.controls[0]);
    await click(plan.controls[1]);
    expect(plan.error()).toBeNull();
    expect(plan.controls[1].checked).toBe(true);
    expect(plan.controls[0].hasAttribute('aria-invalid')).toBe(false);
  });

  it('treats an unticked required checkbox as missing', async () => {
    const { group, blur, click } = await setup();
    const terms = group('terms');
    await blur(terms.controls[0]);
    expect(terms.error()).toBe('Accept the terms to continue');

    await click(terms.controls[0]);
    expect(terms.error()).toBeNull();
  });

  it('works without a fieldset or form', async () => {
    const { root, click } = await setup();
    const checkbox = root.querySelector<HTMLInputElement>('#standalone input')!;
    await click(checkbox);
    expect(checkbox.checked).toBe(true);
    expect(checkbox.hasAttribute('aria-invalid')).toBe(false);
  });
});
