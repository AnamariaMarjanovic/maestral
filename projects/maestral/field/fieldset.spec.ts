import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MsFieldset } from './fieldset';

@Component({
  imports: [MsFieldset],
  template: `
    <ms-fieldset legend="Contact preference" [error]="error()" [required]="true">
      <label><input type="radio" name="contact" /> Email</label>
    </ms-fieldset>
  `,
})
class Host {
  readonly error = signal<string | undefined>(undefined);
}

describe('MsFieldset', () => {
  it('renders a native fieldset with a legend', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelector('fieldset > legend')?.textContent).toContain('Contact preference');
    expect(root.querySelector('legend .ms-field__required')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('shows an explicit error and describes the group with it', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.error.set('Choose how we should contact you');
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const error = root.querySelector('.ms-field__error')!;
    expect(error.textContent?.trim()).toBe('Error: Choose how we should contact you');
    expect(root.querySelector('fieldset')!.getAttribute('aria-describedby')).toBe(error.id);
    expect(root.querySelector('ms-fieldset')!.hasAttribute('data-invalid')).toBe(true);
  });
});
