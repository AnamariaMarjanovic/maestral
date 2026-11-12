import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MsButton } from './button';

@Component({
  imports: [MsButton],
  template: `
    <button msButton id="default">Save</button>
    <button msButton id="danger" variant="danger" size="lg">Delete</button>
    <a msButton id="link" variant="secondary" href="/docs">Docs</a>
  `,
})
class Host {}

describe('MsButton', () => {
  let root: HTMLElement;

  beforeEach(async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    root = fixture.nativeElement;
  });

  const el = (id: string) => root.querySelector<HTMLElement>(`#${id}`)!;

  it('adds the button class to the native element', () => {
    expect(el('default').classList).toContain('ms-button');
    expect(el('default').tagName).toBe('BUTTON');
  });

  it('defaults to the primary variant and medium size', () => {
    expect(el('default').dataset['variant']).toBe('primary');
    expect(el('default').dataset['size']).toBe('md');
  });

  it('reflects variant and size as data attributes', () => {
    expect(el('danger').dataset['variant']).toBe('danger');
    expect(el('danger').dataset['size']).toBe('lg');
  });

  it('works on links and keeps them links', () => {
    expect(el('link').tagName).toBe('A');
    expect(el('link').getAttribute('href')).toBe('/docs');
    expect(el('link').classList).toContain('ms-button');
  });
});
