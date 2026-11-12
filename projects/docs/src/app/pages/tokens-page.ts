import { Component } from '@angular/core';

interface Token {
  readonly name: string;
  readonly use: string;
}

@Component({
  selector: 'docs-tokens-page',
  template: `
    <h1>Design tokens</h1>
    <p class="lead">
      Every color, shape and spacing value is a CSS custom property. Components use only these
      semantic tokens, so changing a token changes every component at once.
    </p>
    <p>
      Colors adapt to light and dark mode automatically. Switch the theme at the top of the page
      to compare. Every text and background pair meets WCAG 2.2 AA in both modes.
    </p>

    <h2>Colors</h2>
    <ul class="tokens">
      @for (token of colors; track token.name) {
        <li class="token">
          <span class="token__swatch" [style.background]="'var(' + token.name + ')'"></span>
          <span>
            <code>{{ token.name }}</code>
            <span class="token__use">{{ token.use }}</span>
          </span>
        </li>
      }
    </ul>

    <h2>Shape: the sail</h2>
    <p>
      Controls round three corners and keep one sharp, like a sail filled by the wind. The sharp
      corner is the tack. It sits at the start of the bottom edge and mirrors in right-to-left
      layouts. Set both tokens to the same value for evenly rounded corners.
    </p>
    <div class="docs-row">
      <div class="sail" aria-hidden="true"></div>
      <ul class="plain">
        <li><code>--ms-radius-sail</code> <span class="token__use">Three rounded corners</span></li>
        <li><code>--ms-radius-tack</code> <span class="token__use">The sharp corner</span></li>
      </ul>
    </div>

    <h2>Spacing</h2>
    <ul class="plain">
      @for (token of spacing; track token.name) {
        <li class="space">
          <span class="space__bar" [style.inline-size]="'var(' + token.name + ')'"></span>
          <code>{{ token.name }}</code>
          <span class="token__use">{{ token.use }}</span>
        </li>
      }
    </ul>

    <h2>Overriding tokens</h2>
    <p>
      Maestral's styles live in cascade layers, so your own styles always win without
      <code>!important</code>. Set tokens on <code>:root</code> or on any element to theme a part
      of the page.
    </p>
    <pre><code>{{ override }}</code></pre>
  `,
  styles: `
    .tokens {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
      gap: var(--ms-space-4);
      margin: var(--ms-space-4) 0;
      padding: 0;
      list-style: none;
      max-width: none;
    }

    .token {
      display: flex;
      align-items: center;
      gap: var(--ms-space-3);
    }

    .token__swatch {
      flex: none;
      inline-size: 3rem;
      block-size: 3rem;
      border: 1px solid var(--ms-color-border);
      border-radius: var(--ms-radius-md);
    }

    .token__use {
      display: block;
      font-size: var(--ms-text-sm);
      color: var(--ms-color-text-muted);
    }

    .sail {
      inline-size: 6rem;
      block-size: 4rem;
      background: var(--ms-color-primary);
      border-radius: var(--ms-radius-sail);
      border-end-start-radius: var(--ms-radius-tack);
    }

    .plain {
      display: grid;
      gap: var(--ms-space-2);
      padding: 0;
      list-style: none;
    }

    .space {
      display: grid;
      grid-template-columns: 2.5rem auto 1fr;
      align-items: center;
      gap: var(--ms-space-3);
    }

    .space .token__use {
      display: inline;
    }

    .space__bar {
      block-size: 0.75rem;
      background: var(--ms-color-primary);
      border-radius: var(--ms-radius-sm);
    }
  `,
})
export default class TokensPage {
  protected readonly colors: Token[] = [
    { name: '--ms-color-bg', use: 'Page background' },
    { name: '--ms-color-surface', use: 'Subtle areas, code blocks' },
    { name: '--ms-color-surface-raised', use: 'Controls and cards' },
    { name: '--ms-color-border', use: 'Decorative borders' },
    { name: '--ms-color-border-control', use: 'Form control borders (3:1)' },
    { name: '--ms-color-text', use: 'Body text' },
    { name: '--ms-color-text-muted', use: 'Hints and secondary text' },
    { name: '--ms-color-primary', use: 'Primary actions, links, focus' },
    { name: '--ms-color-primary-hover', use: 'Primary hover state' },
    { name: '--ms-color-primary-subtle', use: 'Selected and hover backgrounds' },
    { name: '--ms-color-on-primary', use: 'Text on primary' },
    { name: '--ms-color-danger', use: 'Errors and destructive actions' },
    { name: '--ms-color-on-danger', use: 'Text on danger' },
  ];

  protected readonly spacing: Token[] = [
    { name: '--ms-space-1', use: '0.25rem' },
    { name: '--ms-space-2', use: '0.5rem' },
    { name: '--ms-space-3', use: '0.75rem' },
    { name: '--ms-space-4', use: '1rem' },
    { name: '--ms-space-6', use: '1.5rem' },
    { name: '--ms-space-8', use: '2rem' },
  ];

  protected readonly override = `/* styles.css */
:root {
  --ms-color-primary: oklch(52% 0.14 160);
  --ms-radius-tack: var(--ms-radius-sail); /* evenly rounded */
}`;
}
